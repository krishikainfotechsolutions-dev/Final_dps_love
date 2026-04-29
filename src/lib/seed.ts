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
  tagline: "Learning Today, Leading Tomorrow",
  city: "Kanpur",
  phone: "+919519757195",
  whatsapp: "919519757195",
  email: "info@dehradoonpublicschool.in",
  address: "34 Gopal Nagar, Kanpur, Uttar Pradesh",
  board: "NCERT Curriculum (PG to Class 12)",
  medium: "English Medium",
  affiliation: "NCERT Curriculum",
  facebook: "https://www.facebook.com/dehradoonknp",
  youtube: "https://youtube.com/@dpsseniorsecondaryschoolgo8682",
  instagram: "https://www.instagram.com/dehradoonknp",
  appLink: "https://play.google.com/store/apps/details?id=com.uolo.notes",
};

export const seedNotices = [
  { id: "n1", title: "Admission Open 2026–27", body: "Admissions are now open for Toddlers (2.5 yrs) to Class 12. Limited seats available. Contact the school office for fee details and registration.", date: "2026-04-01", pinned: true, link: "" },
  { id: "n2", title: "Download Our School App", body: "Stay updated with notices, homework and results. Download the official DPS Kanpur app from Google Play Store.", date: "2026-04-10", pinned: true, link: "https://play.google.com/store/apps/details?id=com.uolo.notes" },
  { id: "n3", title: "Summer Break 2026", body: "School will remain closed for summer vacation from 21 May to 30 June 2026. Classes resume on 1 July 2026.", date: "2026-04-20", pinned: false, link: "" },
  { id: "n4", title: "Parent-Teacher Meeting", body: "PTM is scheduled for the second Saturday of every month from 10:00 AM to 1:00 PM. All parents are requested to attend.", date: "2026-04-12", pinned: false, link: "" },
  { id: "n5", title: "Board Result Announcement", body: "Class 10 & 12 board results will be declared as per official board notification. Students are advised to check the school notice board regularly.", date: "2026-03-25", pinned: false, link: "" },
  { id: "n6", title: "Graduation Day Ceremony", body: "Graduation Day Ceremony will be held on 30–31 March every year. Parents of graduating students are cordially invited.", date: "2026-03-15", pinned: false, link: "" },
];

export const seedEvents = [
  { id: "e1", title: "Independence Day Celebration", description: "Patriotic performances, flag hoisting and cultural programs by our students celebrating the spirit of freedom and national pride.", date: "2025-08-15", location: "School Ground", coverImage: indep1, images: [indep1, indep2, campus1] },
  { id: "e2", title: "Janmashtami Festival", description: "Students dressed as Krishna and Radha, devotional songs, dance performances and traditional Dahi Handi celebration on campus.", date: "2025-08-16", location: "School Ground", coverImage: janm1, images: [janm1, janm2, indep2] },
  { id: "e3", title: "Annual Sports Meet", description: "Inter-house sports competition with athletics, team sports, chess, carrom, table tennis and badminton events across all age groups.", date: "2025-12-12", location: "Sports Field", coverImage: campus3, images: [campus3, campus1, campus2] },
  { id: "e4", title: "Science Exhibition", description: "Innovative student-led projects aligned to the NCERT curriculum showcasing creativity in science, technology and sustainability.", date: "2026-01-20", location: "Science Block", coverImage: campus2, images: [campus2, campus1, campus3] },
  { id: "e5", title: "Annual Day Function", description: "An evening of music, drama and dance celebrating student talent. Prize distribution for academic and co-curricular excellence.", date: "2026-02-14", location: "Main Auditorium", coverImage: campus1, images: [campus1, indep1, janm1] },
];

export const seedStaff = [
  { id: "s1", name: "Dr. Anjali Sharma", role: "Principal", subjects: ["Leadership"], bio: "20+ years of experience leading premier NCERT institutions across North India.", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { id: "s2", name: "Mr. Rajeev Mishra", role: "Vice Principal", subjects: ["Mathematics"], bio: "Mentoring future engineers and innovators for over 15 years.", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { id: "s3", name: "Ms. Priya Verma", role: "Senior Teacher", subjects: ["English", "Literature"], bio: "English faculty with a passion for creative writing and communication skills.", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
  { id: "s4", name: "Mr. Suresh Tiwari", role: "Science HOD", subjects: ["Physics", "Chemistry"], bio: "Leading our STEM curriculum with inquiry-based learning aligned to NCERT syllabus.", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
  { id: "s5", name: "Ms. Kavita Singh", role: "Sports Coordinator", subjects: ["Physical Education"], bio: "National-level athlete coaching students in cricket, badminton and athletics.", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: "s6", name: "Mr. Anil Pandey", role: "Computer Science", subjects: ["Computer Science", "AI"], bio: "Introducing students to AI, robotics and modern programming.", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" },
  { id: "s7", name: "Mrs. Sunita Yadav", role: "Hindi HOD", subjects: ["Hindi", "Sanskrit"], bio: "Sahitya Ratna with a love for classical Hindi literature and NCERT curriculum.", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { id: "s8", name: "Mr. Deepak Joshi", role: "Maths Faculty", subjects: ["Mathematics"], bio: "Experienced Mathematics teacher with strong command of NCERT exam patterns.", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80" },
  { id: "s9", name: "Ms. Neha Kapoor", role: "Biology Faculty", subjects: ["Biology"], bio: "NCERT Biology specialist with 12 years of teaching experience.", photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80" },
  { id: "s10", name: "Mr. Vivek Saxena", role: "Commerce HOD", subjects: ["Accounts", "Business Studies"], bio: "Chartered Accountant turned passionate commerce educator.", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: "s11", name: "Mrs. Pooja Bhatt", role: "Pre-Primary Head", subjects: ["Early Childhood"], bio: "Specialist in play-based learning for Toddlers, Play Group, JRKG and SRKG.", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80" },
  { id: "s12", name: "Mr. Ramesh Dubey", role: "Social Science", subjects: ["History", "Civics"], bio: "Storyteller bringing NCERT History and Civics alive in the classroom.", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80" },
  { id: "s13", name: "Ms. Ritu Khanna", role: "Art & Craft", subjects: ["Visual Arts"], bio: "Award-winning artist guiding young creators across all classes.", photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80" },
  { id: "s14", name: "Mr. Aakash Bansal", role: "Music Teacher", subjects: ["Music"], bio: "Classically trained vocalist and tabla player nurturing student talent.", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
  { id: "s15", name: "Ms. Shilpa Goyal", role: "Geography Faculty", subjects: ["Geography"], bio: "Field-trip enthusiast and cartography expert.", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80" },
  { id: "s16", name: "Mr. Prakash Trivedi", role: "Physics Faculty", subjects: ["Physics"], bio: "Senior Physics teacher with 18 years of NCERT teaching experience.", photo: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&q=80" },
  { id: "s17", name: "Mrs. Aarti Chauhan", role: "Chemistry Faculty", subjects: ["Chemistry"], bio: "PhD in Organic Chemistry, experienced NCERT Chemistry mentor.", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80" },
  { id: "s18", name: "Mr. Sanjay Rastogi", role: "Economics", subjects: ["Economics"], bio: "Bringing real-world markets into the NCERT Economics classroom.", photo: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=400&q=80" },
  { id: "s19", name: "Ms. Megha Srivastava", role: "Counsellor", subjects: ["Psychology"], bio: "Certified child counsellor and career guidance mentor.", photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80" },
  { id: "s20", name: "Mr. Harsh Vardhan", role: "Yoga & Wellness", subjects: ["Yoga"], bio: "Promoting mindfulness and physical wellbeing among students.", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { id: "s21", name: "Mrs. Lata Awasthi", role: "Librarian", subjects: ["Library Science"], bio: "Curating a rich reading culture across the school community.", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
  { id: "s22", name: "Mr. Tarun Chand", role: "IT Coordinator", subjects: ["Computer Science"], bio: "Smart classroom and digital lab in-charge.", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80" },
];

export const PRINCIPAL = {
  name: "Mr. Ashissh Shuklaa",
  title: "Principal",
  photo: principalPhoto,
  message:
    "Dehradoon Public Senior Secondary School is managed by a visionary and experienced management team that is deeply committed to educational excellence. The management ensures that the school maintains high standards in academics, discipline, infrastructure, and student welfare.
\n
Through proper planning, continuous monitoring, and innovative initiatives, the management plays a crucial role in creating a positive and progressive learning atmosphere. Their dedication and guidance have been instrumental in the consistent growth and success of the institution since 1992.",
  signature: "— Mr. Ashissh Shuklaa",
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
  { id: "t1", name: "Aarav Sharma", class: "Class XII Science", year: "2025", percentage: 98.4, rank: 1, photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80" },
  { id: "t2", name: "Saanvi Tripathi", class: "Class XII Commerce", year: "2025", percentage: 97.8, rank: 1, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { id: "t3", name: "Rohan Mishra", class: "Class X", year: "2025", percentage: 97.2, rank: 1, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
  { id: "t4", name: "Ishita Agarwal", class: "Class XII Science", year: "2025", percentage: 96.6, rank: 2, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { id: "t5", name: "Aryan Verma", class: "Class X", year: "2025", percentage: 96.0, rank: 2, photo: "https://images.unsplash.com/photo-1502720705749-871143f0e671?w=400&q=80" },
  { id: "t6", name: "Diya Pandey", class: "Class XII Commerce", year: "2025", percentage: 95.8, rank: 2, photo: "https://images.unsplash.com/photo-1521252659862-eec69941b071?w=400&q=80" },
];

export const seedKeyDates = [
  { id: "k1", title: "Session Begins", date: "2026-04-01", description: "Academic session 2026–27 begins for all classes from Toddlers to Class 12.", type: "Academic", link: "" },
  { id: "k2", title: "First Term Exam — Part 1", date: "2026-05-10", description: "First term examination (Part 1) for all classes.", type: "Exam", link: "" },
  { id: "k3", title: "Summer Break", date: "2026-05-21", description: "School closed from 21 May to 30 June. Classes resume 1 July.", type: "Holiday", link: "" },
  { id: "k4", title: "First Term Exam — Part 2", date: "2026-07-15", description: "First term examination (Part 2) including group discussion and subject enrichment activities.", type: "Exam", link: "" },
  { id: "k5", title: "Independence Day", date: "2026-08-15", description: "Flag hoisting and cultural programme on campus.", type: "Event", link: "" },
  { id: "k6", title: "Mid-Term Exam — Part 1", date: "2026-09-15", description: "Mid-term examination (Part 1) for all classes.", type: "Exam", link: "" },
  { id: "k7", title: "Mid-Term Exam — Part 2", date: "2026-10-05", description: "Mid-term examination (Part 2) with objective and activity-based assessment.", type: "Exam", link: "" },
  { id: "k8", title: "Annual Day Function", date: "2026-12-18", description: "Annual cultural function, prize distribution and student talent showcase.", type: "Event", link: "" },
  { id: "k9", title: "Final Term Exam — Part 1", date: "2027-01-10", description: "Final term examination (Part 1) — descriptive for Classes 1 to 8.", type: "Exam", link: "" },
  { id: "k10", title: "Winter Break", date: "2027-01-25", description: "Winter break dates will be declared after examinations.", type: "Holiday", link: "" },
  { id: "k11", title: "Final Term Exam — Part 2", date: "2027-02-10", description: "Final term examination (Part 2) — objective and enrichment activities.", type: "Exam", link: "" },
  { id: "k12", title: "Graduation Day Ceremony", date: "2027-03-30", description: "Graduation Day Ceremony for outgoing students — 30th & 31st March.", type: "Event", link: "" },
];

export const seedAwards = [
  { id: "a1", title: "Best Emerging School — Kanpur Region", year: "2024", description: "Education Excellence Awards" },
  { id: "a2", title: "Excellence in Co-Curricular Activities", year: "2023", description: "UP State Education Council" },
  { id: "a3", title: "Smart Classroom Innovation Award", year: "2024", description: "For digital learning and interactive panel adoption" },
  { id: "a4", title: "Inter-School Cricket Champions", year: "2024", description: "U-17 District Tournament" },
  { id: "a5", title: "100% Board Pass Rate", year: "2024", description: "Outstanding results in Class 10 & 12 board examinations" },
  { id: "a6", title: "Green & Safe Campus Award", year: "2023", description: "For CCTV surveillance, discipline and eco-friendly campus" },
];
