import { NextResponse } from "next/server";

const resumeData = {
  name: "Shabnam Beiraghian",
  title: "Apple Specialist Candidate · Customer-Obsessed Retail Professional",
  location: "Burnaby, BC",
  email: "your.email@example.com",
  linkedin: "https://www.linkedin.com/in/your-linkedin",
  github: "https://github.com/your-github",
  summary:
    "Energetic, customer-obsessed retail professional with 5+ years of high-volume customer service and product recommendation experience. Strong interest in technology (currently studying Full-Stack Web Development at BCIT) and eager to bring that to an Apple Retail team.",
  experience: [
    {
      role: "Inside Automotive Sales Associate",
      company: "Inside Automotive",
      location: "Vancouver, BC",
      start: "Jul 2022",
      end: "Mar 2025",
      bullets: [
        "Engaged daily with 100+ customers, diagnosing their needs and recommending appropriate parts.",
        "Educated customers on product features, compatibility, and installation.",
        "Collaborated with warehouse and delivery teams to ensure timely fulfilment and accuracy.",
        "Organized and corrected catalog entries, improving lookup speed and reducing wait times.",
      ],
    },
    {
      role: "Head Cashier",
      company: "Retail Store",
      location: "Vancouver, BC",
      start: "Nov 2019",
      end: "Jul 2022",
      bullets: [
        "Managed cash operations and led a team of cashiers while keeping register discrepancies at zero.",
        "Trained staff on customer service standards and product knowledge.",
        "Worked with store leadership to align front-end operations with customer experience goals.",
      ],
    },
  ],
  education: [
    {
      program: "Diploma, Full-Stack Web Development",
      school: "British Columbia Institute of Technology (BCIT)",
      location: "Vancouver, BC",
      start: "Sep 2024",
      end: "Apr 2026 (in progress)",
    },
  ],
  skills: [
    "Customer service & customer experience",
    "Explaining products clearly",
    "High-volume communication (100+ interactions/day)",
    "Accountability and accuracy",
  ],
};

export async function GET() {
  return NextResponse.json(resumeData);
}
