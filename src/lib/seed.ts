import campus1 from "@/assets/campus-1.jpg";
import campus2 from "@/assets/campus-2.jpg";
import campus3 from "@/assets/campus-3.jpg";
import principalPhoto from "@/assets/principal.jpg";
import indep1 from "@/assets/event-independence-1.jpg";
import indep2 from "@/assets/event-independence-2.jpg";
import janm1 from "@/assets/event-janmashtami-1.jpg";
import janm2 from "@/assets/event-janmashtami-2.jpg";

export const SCHOOL = {
  name: "Dehradoon Public Senior Secondary School",
  shortName: "DPS Kanpur",
  tagline: "Every Child is Unique in its Own Way",
  city: "Kanpur", 
  phone: "8517577185",
  whatsapp: "918517577185",
  email: "info@dehradoonpublicschool.in",
  address: "Dehradoon Public Senior Secondary School, Kanpur, Uttar Pradesh, India",
};

export const seedNotices = [
  { id: "n1", title: "Annual Result Declaration 2025", body: "Class X & XII results will be declared on May 13, 2025. Parents are invited to attend the ceremony.", date: "2025-05-10", pinned: true },
  { id: "n2", title: "Summer Vacation Notice", body917428863727: "School will remain closed for summer break from May 25 to June 30. Reopens July 1.", date: "2025-05-20", pinned: false },
  { id: "n3", title: "Admission Open 2025-26", body: "Admissions for Nursery to Class IX are now open. Limited seats available.", date: "2025-04-01", pinned: true },
  { id: "n4", title: "Parent-Teacher Meeting", body: "PTM scheduled for the second Saturday of every month from 10 AM to 1 PM.", date: "2025-04-12", pinned: false },
  { id: "n5", title: "New Smart Classrooms", body: "Smart classrooms with interactive panels installed across all sections.", date: "2025-03-15", pinned: false },
  { id: "n6", title: "Sports Trials Announcement", body: "Trials for the inter-school cricket and athletics teams begin next week.", date: "2025-03-08", pinned: false },
];

export const seedEvents = [
  { id: "e1", title: "Independence Day Celebration", description: "Patriotic performances, flag hoisting and cultural programs by our students celebrating 79 years of freedom.", date: "2024-08-15", location: "School Auditorium", coverImage: indep1, images: [indep1, indep2, campus1] },
  { id: "e2", title: "Janmashtami Festival", description: "Students dressed as Krishna and Radha, devotional songs, dance performances and traditional Dahi Handi celebration.", date: "2024-08-26", location: "School Ground", coverImage: janm1, images: [janm1, janm2, indep2] },
  { id: "e3", title: "Annual Sports Meet", description: "Three-day sports extravaganza with athletics, team sports and inter-house competitions.", date: "2024-12-12", location: "Sports Field", coverImage: campus3, images: [campus3, campus1, campus2] },
  { id: "e4", title: "Science Exhibition", description: "Innovative student-led projects in robotics, sustainability and applied physics.", date: "2025-01-20", location: "Science Block", coverImage: campus2, images: [campus2, campus1, campus3] },
  { id: "e5", title: "Annual Day Function", description: "An evening of music, drama and dance celebrating the talents of our students.", date: "2025-02-14", location: "Main Auditorium", coverImage: campus1, images: [campus1, indep1, janm1] },
];

export const seedStaff = [
  { id: "s1", name: "Dr. Anjali Sharma", role: "Principal", subjects: ["Leadership"], bio: "20+ years of experience leading premier institutions across North India.", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { id: "s2", name: "Mr. Rajeev Mishra", role: "Vice Principal", subjects: ["Mathematics"], bio: "Mentoring future engineers and innovators for over 15 years.", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { id: "s3", name: "Ms. Priya Verma", role: "Senior Teacher", subjects: ["English", "Literature"], bio: "Cambridge-certified English faculty with a passion for creative writing.", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
  { id: "s4", name: "Mr. Suresh Tiwari", role: "Science HOD", subjects: ["Physics", "Chemistry"], bio: "Leading our STEM curriculum with inquiry-based learning.", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
  { id: "s5", name: "Ms. Kavita Singh", role: "Sports Coordinator", subjects: ["Physical Education"], bio: "National-level athlete coaching state champions in cricket & athletics.", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: "s6", name: "Mr. Anil Pandey", role: "Computer Science", subjects: ["Computer Science", "AI"], bio: "Introducing students to AI, robotics and modern programming.", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { id: "s7", name: "Mrs. Sunita Yadav", role: "Hindi HOD", subjects: ["Hindi", "Sanskrit"], bio: "Sahitya Ratna with a love for classical literature.", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { id: "s8", name: "Mr. Deepak Joshi", role: "Maths Faculty", subjects: ["Mathematics"], bio: "Olympiad mentor and JEE foundation coach.", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80" },
  { id: "s9", name: "Ms. Neha Kapoor", role: "Biology Faculty", subjects: ["Biology"], bio: "NEET mentor with 12 years of teaching experience.", photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80" },
  { id: "s10", name: "Mr. Vivek Saxena", role: "Commerce HOD", subjects: ["Accounts", "Business Studies"], bio: "Chartered Accountant turned passionate educator.", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: "s11", name: "Mrs. Pooja Bhatt", role: "Pre-Primary Head", subjects: ["Early Childhood"], bio: "Specialist in play-based and Montessori learning.", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80" },
  { id: "s12", name: "Mr. Ramesh Dubey", role: "Social Science", subjects: ["History", "Civics"], bio: "Storyteller bringing history alive in the classroom.", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80" },
  { id: "s13", name: "Ms. Ritu Khanna", role: "Art & Craft", subjects: ["Visual Arts"], bio: "Award-winning artist guiding young creators.", photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80" },
  { id: "s14", name: "Mr. Aakash Bansal", role: "Music Teacher", subjects: ["Music"], bio: "Classically trained vocalist and tabla player.", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
  { id: "s15", name: "Ms. Shilpa Goyal", role: "Geography Faculty", subjects: ["Geography"], bio: "Field-trip enthusiast and cartography expert.", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" },
  { id: "s16", name: "Mr. Prakash Trivedi", role: "Physics Faculty", subjects: ["Physics"], bio: "JEE Advanced mentor with 18 years of experience.", photo: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&q=80" },
  { id: "s17", name: "Mrs. Aarti Chauhan", role: "Chemistry Faculty", subjects: ["Chemistry"], bio: "PhD in Organic Chemistry, NEET mentor.", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80" },
  { id: "s18", name: "Mr. Sanjay Rastogi", role: "Economics", subjects: ["Economics"], bio: "Bringing real-world markets into the classroom.", photo: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=400&q=80" },
  { id: "s19", name: "Ms. Megha Srivastava", role: "Counsellor", subjects: ["Psychology"], bio: "Certified child counsellor and career mentor.", photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80" },
  { id: "s20", name: "Mr. Harsh Vardhan", role: "Yoga & Wellness", subjects: ["Yoga"], bio: "Promoting mindfulness and physical wellbeing.", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { id: "s21", name: "Mrs. Lata Awasthi", role: "Librarian", subjects: ["Library Science"], bio: "Curating a reading culture across the school.", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
  { id: "s22", name: "Mr. Tarun Chand", role: "IT Coordinator", subjects: ["Computer Science"], bio: "Robotics and Atal Tinkering Lab in-charge.", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80" },
];

export const PRINCIPAL = {
  name: "Mrs. Ashish Shukla",
  title: "Principal",
  photo: principalPhoto,
  message:
    "At Dehradoon Public Senior Secondary School, we believe education is more than academics — it's the joyful journey of discovering one's true potential. Our endeavour is to nurture inquisitive minds, kind hearts and confident voices. Every child here is celebrated as unique, and our dedicated faculty walks alongside each student, helping them shine brightly in their own way. Together with our parent community, we are building a generation of compassionate leaders ready to embrace tomorrow with courage and integrity.",
  signature: "— Mrs. Ashish Shukla",
};

export const seedGallery = [
  { id: "g1", title: "Independence Day", category: "Independence Day", type: "image" as const, url: indep1 },
  { id: "g2", title: "Tricolor Spirit", category: "Independence Day", type: "image" as const, url: indep2 },
  { id: "g3", title: "Krishna Janmashtami", category: "Janmashtami", type: "image" as const, url: janm1 },
  { id: "g4", title: "Devotional Performance", category: "Janmashtami", type: "image" as const, url: janm2 },
  { id: "g5", title: "School Campus", category: "Campus", type: "image" as const, url: campus1 },
  { id: "g6", title: "Main Building", category: "Campus", type: "image" as const, url: campus2 },
  { id: "g7", title: "Front Facade", category: "Campus", type: "image" as const, url: campus3 },
  { id: "g8", title: "Cultural Day", category: "Independence Day", type: "image" as const, url: indep1 },
  { id: "g9", title: "Festival Joy", category: "Janmashtami", type: "image" as const, url: janm2 },
];

export const seedToppers = [
  { id: "t1", name: "Aarav Sharma", class: "XII Science", year: "2024", percentage: 98.4, rank: 1, photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
  { id: "t2", name: "Saanvi Tripathi", class: "XII Commerce", year: "2024", percentage: 97.8, rank: 2, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { id: "t3", name: "Rohan Mishra", class: "X", year: "2024", percentage: 97.2, rank: 1, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { id: "t4", name: "Ishita Agarwal", class: "XII Science", year: "2024", percentage: 96.6, rank: 3, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { id: "t5", name: "Aryan Verma", class: "X", year: "2024", percentage: 96.0, rank: 2, photo: "https://images.unsplash.com/photo-1502720705749-871143f0e671?w=400&q=80" },
  { id: "t6", name: "Diya Pandey", class: "XII Commerce", year: "2024", percentage: 95.8, rank: 3, photo: "https://images.unsplash.com/photo-1521252659862-eec69941b071?w=400&q=80" },
];

export const seedKeyDates = [
  { id: "k1", title: "Session Begins", date: "2025-04-01", description: "Academic session 2025-26 begins for all classes.", type: "Academic" },
  { id: "k2", title: "First Unit Test", date: "2025-05-15", description: "Cycle test for classes V-XII.", type: "Exam" },
  { id: "k3", title: "Summer Break", date: "2025-05-25", description: "School closed till June 30.", type: "Holiday" },
  { id: "k4", title: "Independence Day", date: "2025-08-15", description: "Flag hoisting and cultural programme.", type: "Event" },
  { id: "k5", title: "Half-Yearly Exams", date: "2025-09-20", description: "Half-yearly assessment for all senior classes.", type: "Exam" },
  { id: "k6", title: "Annual Day", date: "2025-12-18", description: "Annual cultural function and prize distribution.", type: "Event" },
  { id: "k7", title: "Pre-Board Exams", date: "2026-01-10", description: "For classes X and XII.", type: "Exam" },
  { id: "k8", title: "Result Declaration", date: "2026-03-30", description: "Annual results declared.", type: "Academic" },
];

export const seedAwards = [
  { id: "a1", title: "Best Emerging School - Kanpur Region", year: "2024", description: "Education Excellence Awards" },
  { id: "a2", title: "Excellence in Co-Curricular Activities", year: "2023", description: "State Education Council" },
  { id: "a3", title: "Green Campus Award", year: "2023", description: "For eco-friendly initiatives & solar power adoption" },
  { id: "a4", title: "Inter-School Cricket Champions", year: "2024", description: "U-17 District Tournament" },
  { id: "a5", title: "Science Olympiad Gold", year: "2024", description: "National Science Olympiad - 3 medals" },
  { id: "a6", title: "100% Board Pass Rate", year: "2024", description: "CBSE Class X & XII results" },
];
