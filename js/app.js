// Shared helpers
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('abc_bookings') || '[]');
  } catch (e) {
    return [];
  }
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('abc_bookings', JSON.stringify(bookings));
}

function isSlotBooked(tutorId, slot) {
  return getBookings().some(b => b.tutorId === tutorId && b.slot === slot);
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function iconForSubject(subject) {
  const s = subject.toLowerCase();
  if (s.includes('read')) return '📖';
  if (s.includes('algebra') || s.includes('math')) return '📐';
  if (s.includes('science')) return '🔬';
  return '✏️';
}

// ---- index.html: tutor grid + subject filter ----
function renderTutorGrid() {
  const grid = document.getElementById('tutor-grid');
  const filterSelect = document.getElementById('subject-filter');
  if (!grid) return;

  const allSubjects = Array.from(new Set(TUTORS.flatMap(t => t.subjects))).sort();
  if (filterSelect) {
    allSubjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      filterSelect.appendChild(opt);
    });
    filterSelect.addEventListener('change', () => draw(filterSelect.value));
  }

  function draw(subject) {
    grid.innerHTML = '';
    const list = subject ? TUTORS.filter(t => t.subjects.includes(subject)) : TUTORS;
    list.forEach(t => {
      const card = document.createElement('a');
      card.href = `tutor.html?id=${t.id}`;
      card.className = 'tutor-card';
      card.style.display = 'block';
      card.style.color = 'inherit';
      const pills = t.subjects.map(s => `<span class="subject-pill">${iconForSubject(s)} ${s}</span>`).join('');
      card.innerHTML = `
        <div class="avatar" style="background:${t.color}">${t.initials}</div>
        <h3>${t.name}</h3>
        <div class="subjects">${t.grades} · ${t.format}</div>
        <div class="subject-pills">${pills}</div>
        <div class="rate">$${t.rate}/hr</div>
      `;
      grid.appendChild(card);
    });
  }
  draw('');
}

// ---- tutor.html: profile ----
function renderTutorProfile() {
  const container = document.getElementById('tutor-profile');
  if (!container) return;
  const id = parseInt(getParam('id'), 10);
  const tutor = TUTORS.find(t => t.id === id);
  if (!tutor) {
    container.innerHTML = '<p>Tutor not found. <a href="index.html">Back to all tutors</a></p>';
    return;
  }

  trackEvent('tutor_profile_viewed', { tutor_name: tutor.name, tutor_id: tutor.id });

  const availabilityHtml = tutor.availability.map(slot => {
    const booked = isSlotBooked(tutor.id, slot);
    return `<li class="${booked ? 'booked' : ''}">
      <span>${slot}</span>
      <span class="badge ${booked ? 'booked' : ''}">${booked ? 'Booked' : 'Available'}</span>
    </li>`;
  }).join('');

  const pills = tutor.subjects.map(s => `<span class="subject-pill">${iconForSubject(s)} ${s}</span>`).join('');

  container.innerHTML = `
    <div class="avatar" style="background:${tutor.color}">${tutor.initials}</div>
    <div>
      <h2>${tutor.name}</h2>
      <div class="subject-pills" style="justify-content:flex-start;">${pills}</div>
      <div class="detail-row"><span class="label">Grades</span><span>${tutor.grades}</span></div>
      <div class="detail-row"><span class="label">Rate</span><span>$${tutor.rate}/hr</span></div>
      <div class="detail-row"><span class="label">Session Length</span><span>${tutor.duration}</span></div>
      <div class="detail-row"><span class="label">Format</span><span>${tutor.format}</span></div>
      <p>${tutor.bio}</p>
      <div class="detail-row"><span class="label">Availability</span></div>
      <ul class="availability-list">${availabilityHtml}</ul>
      <br>
      <a class="btn" href="booking.html?id=${tutor.id}">Book this tutor</a>
    </div>
  `;
}

// ---- booking.html: form + confirmation ----
function renderBookingForm() {
  const container = document.getElementById('booking-container');
  if (!container) return;
  const id = parseInt(getParam('id'), 10);
  const tutor = TUTORS.find(t => t.id === id);
  if (!tutor) {
    container.innerHTML = '<p>Tutor not found. <a href="index.html">Back to all tutors</a></p>';
    return;
  }

  trackEvent('booking_started', { tutor_name: tutor.name, tutor_id: tutor.id });

  const openSlots = tutor.availability.filter(slot => !isSlotBooked(tutor.id, slot));
  const slotOptions = openSlots.length
    ? openSlots.map(s => `<option value="${s}">${s}</option>`).join('')
    : '<option value="">No open slots right now</option>';
  const subjectOptions = tutor.subjects.map(s => `<option value="${s}">${s}</option>`).join('');

  container.innerHTML = `
    <a class="back-link" href="tutor.html?id=${tutor.id}">&larr; Back to ${tutor.name}'s profile</a>
    <form class="booking-form" id="booking-form">
      <h2>Book a session with ${tutor.name}</h2>
      <p style="color:var(--muted); font-size:0.9rem; margin-top:-8px;">You can book one 1-hour session.</p>

      <label for="parentName">Parent name</label>
      <input type="text" id="parentName" required>

      <label for="parentEmail">Parent email</label>
      <input type="email" id="parentEmail" required>

      <label for="studentName">Student first name</label>
      <input type="text" id="studentName" required>

      <label for="studentGrade">Student grade</label>
      <select id="studentGrade" required>
        <option value="">Select grade</option>
        ${['K',1,2,3,4,5,6,7,8,9,10,11,12].map(g => `<option value="${g}">${g}</option>`).join('')}
      </select>

      <label for="subject">Subject</label>
      <select id="subject" required>${subjectOptions}</select>

      <label for="slot">Requested time</label>
      <select id="slot" required>${slotOptions}</select>

      <br><br>
      <button type="submit" class="btn" ${openSlots.length ? '' : 'disabled'}>Request booking</button>
    </form>
  `;

  document.getElementById('booking-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const slot = document.getElementById('slot').value;
    const booking = {
      tutorId: tutor.id,
      tutorName: tutor.name,
      parentName: document.getElementById('parentName').value,
      parentEmail: document.getElementById('parentEmail').value,
      studentName: document.getElementById('studentName').value,
      studentGrade: document.getElementById('studentGrade').value,
      subject: document.getElementById('subject').value,
      slot: slot,
      bookedAt: new Date().toISOString()
    };
    saveBooking(booking);
    trackEvent('booking_completed', {
      tutor_name: tutor.name,
      tutor_id: tutor.id,
      subject: booking.subject
    });

    container.innerHTML = `
      <div class="confirmation">
        <div class="checkmark">&#10003;</div>
        <h2>Request sent!</h2>
        <p>Thanks, ${booking.parentName} — your request for ${booking.studentName} to see
        ${tutor.name} on <strong>${slot}</strong> has been received.</p>
        <p>Dana will follow up by email or text to confirm the session.</p>
        <a class="btn secondary" href="index.html">Browse more tutors</a>
      </div>
    `;
  });
}

// ---- contact form (index.html, #contact section) ----
function getContactMessages() {
  try {
    return JSON.parse(localStorage.getItem('abc_contact_messages') || '[]');
  } catch (e) {
    return [];
  }
}

function renderContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      message: document.getElementById('contactMessage').value,
      sentAt: new Date().toISOString()
    };
    const messages = getContactMessages();
    messages.push(message);
    localStorage.setItem('abc_contact_messages', JSON.stringify(messages));
    trackEvent('contact_form_submitted', {});

    const wrapper = document.getElementById('contact-wrapper');
    wrapper.innerHTML = `
      <div class="confirmation">
        <div class="checkmark">&#10003;</div>
        <h3>Thanks, ${message.name}!</h3>
        <p>Your message has been received. Dana will get back to you soon.</p>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderTutorGrid();
  renderTutorProfile();
  renderBookingForm();
  renderContactForm();
});
