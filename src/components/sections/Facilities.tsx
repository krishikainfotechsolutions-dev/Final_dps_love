import { motion } from "framer-motion";
import { Camera, Monitor, Gamepad2 } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const indoorSports = ["Chess", "Carrom", "Table Tennis", "Badminton (Indoor)"];

const facilities = [
  {
    icon: Camera,
    title: "CCTV Surveillance",
    description:
      "The campus is fully covered with strategically placed CCTV cameras, ensuring continuous monitoring and a safe, secure environment for students and staff at all times.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Monitor,
    title: "Smart Classrooms",
    description:
      "Our classrooms are equipped with digital boards and audio-visual tools that make learning more engaging and interactive, supporting better concept clarity and student participation.",
    accent: "bg-gold/15 text-foreground",
  },
  {
    icon: Gamepad2,
    title: "Indoor Sports",
    description:
      "A dedicated space for indoor games promotes physical fitness, mental sharpness, teamwork, and sportsmanship among students.",
    accent: "bg-primary/10 text-primary",
    sports: indoorSports,
  },
];

export default function Facilities() {
  return (
    <section id="facilities" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Facilities"
          title="Built for Better Learning"
          subtitle="A safe, modern, and activity-rich campus that supports every student's growth."
        />

        <motion.div
          variants={stagger(0.05, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid md:grid-cols-3 gap-5 mt-2"
        >
          {facilities.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-6 bg-card border hover-lift"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.accent}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>

              {f.sports && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.sports.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/20 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 h-px bg-gradient-to-r from-primary/30 via-gold/40 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
