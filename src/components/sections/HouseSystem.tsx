import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const houses = [
  {
    name: "Red House",
    quality: "Energy",
    color: "bg-red-500/15 border-red-400/40 text-red-500",
    dot: "bg-red-500",
    emoji: "🔴",
  },
  {
    name: "Blue House",
    quality: "Unity",
    color: "bg-blue-500/15 border-blue-400/40 text-blue-500",
    dot: "bg-blue-500",
    emoji: "🔵",
  },
  {
    name: "Green House",
    quality: "Growth",
    color: "bg-green-500/15 border-green-500/40 text-green-600",
    dot: "bg-green-500",
    emoji: "🟢",
  },
  {
    name: "Yellow House",
    quality: "Enthusiasm",
    color: "bg-yellow-400/15 border-yellow-400/40 text-yellow-600",
    dot: "bg-yellow-400",
    emoji: "🟡",
  },
];

const activities = [
  "Inter-House Sports Events",
  "Cultural Competitions",
  "Academic Challenges",
  "Quiz & Debate Programs",
];

export default function HouseSystem() {
  return (
    <section id="house" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-muted/40 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="House System"
          title="Four Houses, One Spirit"
          subtitle="A structured house system that builds teamwork, leadership, and a strong sense of belonging."
        />

        {/* House Cards */}
        <motion.div
          variants={stagger(0.05, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
        >
          {houses.map((house) => (
            <motion.div
              key={house.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className={`rounded-2xl p-5 border text-center ${house.color} transition-transform`}
            >
              <span className="text-3xl">{house.emoji}</span>
              <h3 className="font-bold text-base mt-3">{house.name}</h3>
              <p className="text-xs font-medium opacity-70 mt-1">{house.quality}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Description + Activities */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-5 grid md:grid-cols-2 gap-5"
        >
          <div className="rounded-2xl p-6 bg-card border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground">About the System</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every student is assigned to one of four houses — Red, Blue, Green, or Yellow — each symbolising Energy, Unity, Growth, and Enthusiasm. The house system fosters healthy competition, cooperation, and leadership from an early age, making school life more engaging and meaningful.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-card border border-gold/30">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/60 mb-4">Inter-House Activities</p>
            <ul className="space-y-3">
              {activities.map((act) => (
                <li key={act} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {act}
                </li>
              ))}
            </ul>
            <div className="mt-5 h-px bg-gradient-to-r from-gold/40 via-primary/30 to-transparent" />
            <p className="text-xs text-muted-foreground mt-4">
              These activities are held throughout the year, helping students develop confidence, discipline, and a winning mindset.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
