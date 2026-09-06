// Placeholder tutor data — replace with real details once Dana provides them.
// Every session is a fixed 1-hour block (confirmed by Dana), so availability
// is listed as individual 1-hour slots rather than broad time windows.
const TUTORS = [
  {
    id: 1,
    name: "Sarah Chen",
    initials: "SC",
    color: "#3A7D6D",
    subjects: ["Elementary Math", "Pre-Algebra"],
    grades: "Grades 3–6",
    rate: 45,
    duration: "1 hour",
    format: "In-person or online",
    availability: [
      "Mon 3:00–4:00 PM", "Mon 4:00–5:00 PM",
      "Wed 3:00–4:00 PM", "Wed 4:00–5:00 PM",
      "Sat 10:00–11:00 AM", "Sat 11:00 AM–12:00 PM", "Sat 12:00–1:00 PM"
    ],
    bio: "5 years tutoring elementary math with a focus on building confidence."
  },
  {
    id: 2,
    name: "Marcus Bell",
    initials: "MB",
    color: "#E8A33D",
    subjects: ["Algebra I", "Algebra II"],
    grades: "Grades 7–9",
    rate: 55,
    duration: "1 hour",
    format: "Online only",
    availability: [
      "Tue 4:00–5:00 PM", "Tue 5:00–6:00 PM", "Tue 6:00–7:00 PM",
      "Thu 4:00–5:00 PM", "Thu 5:00–6:00 PM", "Thu 6:00–7:00 PM"
    ],
    bio: "Former high school math teacher specializing in algebra fundamentals."
  },
  {
    id: 3,
    name: "Priya Nair",
    initials: "PN",
    color: "#B0584D",
    subjects: ["Science"],
    grades: "Grades 5–8",
    rate: 50,
    duration: "1 hour",
    format: "In-person or online",
    availability: [
      "Mon 3:00–4:00 PM", "Mon 4:00–5:00 PM",
      "Wed 3:00–4:00 PM", "Wed 4:00–5:00 PM",
      "Fri 3:00–4:00 PM", "Fri 4:00–5:00 PM"
    ],
    bio: "Makes science hands-on and relatable for middle schoolers."
  },
  {
    id: 4,
    name: "Jamal Rivera",
    initials: "JR",
    color: "#6B7FB8",
    subjects: ["Elementary Reading"],
    grades: "Grades K–3",
    rate: 40,
    duration: "1 hour",
    format: "In-person only",
    availability: [
      "Tue 3:00–4:00 PM", "Tue 4:00–5:00 PM",
      "Thu 3:00–4:00 PM", "Thu 4:00–5:00 PM",
      "Sat 9:00–10:00 AM", "Sat 10:00–11:00 AM"
    ],
    bio: "Reading specialist passionate about early literacy."
  },
  {
    id: 5,
    name: "Emily Okafor",
    initials: "EO",
    color: "#8A6BB8",
    subjects: ["Elementary Math", "Science"],
    grades: "Grades 4–6",
    rate: 45,
    duration: "1 hour",
    format: "In-person or online",
    availability: [
      "Mon 4:00–5:00 PM", "Mon 5:00–6:00 PM",
      "Tue 4:00–5:00 PM", "Tue 5:00–6:00 PM",
      "Wed 4:00–5:00 PM", "Wed 5:00–6:00 PM",
      "Thu 4:00–5:00 PM", "Thu 5:00–6:00 PM"
    ],
    bio: "Loves connecting math and science to real-world examples."
  },
  {
    id: 6,
    name: "David Kim",
    initials: "DK",
    color: "#4D8FB0",
    subjects: ["Algebra II", "Science"],
    grades: "Grades 8–9",
    rate: 55,
    duration: "1 hour",
    format: "Online only",
    availability: [
      "Wed 5:00–6:00 PM", "Wed 6:00–7:00 PM",
      "Fri 5:00–6:00 PM", "Fri 6:00–7:00 PM",
      "Sun 1:00–2:00 PM", "Sun 2:00–3:00 PM"
    ],
    bio: "6 years of experience helping students build strong problem-solving skills."
  }
];
