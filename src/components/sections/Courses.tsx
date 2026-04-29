import { motion } from "framer-motion";
import { BookOpen, Mic, Users, Star } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const streams = [
  {
    name: "Science Stream",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Hindi"],
  },
  {
    name: "Arts Stream",
    subjects: ["English", "Hindi", "Sociology", "Education", "Drawing"],
  },
];

const courricular = [
  { icon: "🎨", label: "Arts" },
  { icon: "🎵", label: "Music" },
  { icon: "💃", label: "Dance" },
  { icon: "🎭", label: "Drama" },
  { icon: "🗣️", label: "Debate" },
  { icon: "🧠", label: "Quiz Programs" },
  { icon: "💻", label: "Computer Literacy" },
  { icon: "📚", label: "Educational Lectures" },
];

export default function Courses() {
  return (
    <section id="courses" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Academics"
          title="Courses & Activities"
          subtitle="Holistic education through strong academics, creative arts, and personality development."
        />

        {/* Streams (Classes 11–12) */}
        <motion.div
          variants={stagger(0.05, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid md:grid-cols-2 gap-5 mt-2"
        >
          {streams.map((stream) => (
            <motion.div
              key={stream.name}
              variants={fadeUp}
              className="rounded-2xl p-6 bg-card border hover-lift"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Classes 11–12</p>
                  <p className="font-semibold text-foreground">{stream.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {stream.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/20 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Co-Curricular Activities */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-5 rounded-2xl p-6 bg-card border"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center">
              <Star className="w-4 h-4 text-foreground" />
            </div>
            <p className="font-semibold text-foreground">Co-Curricular Activities</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {courricular.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-xl py-4 px-3 bg-muted/50 border border-border/60 hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-foreground text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* English Speaking Program */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-5 rounded-2xl p-6 bg-card border border-gold/30 hover-lift"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/60 mb-1">Daily Practice</p>
              <h4 className="font-semibold text-foreground mb-2">English Speaking Enhancement Program</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every morning, students present a <span className="text-primary font-medium">"Thought of the Day"</span> to build confidence and communication. Special Group Discussion sessions are conducted for Classes 1–8, with regular practice focused on fluency, clarity, and personality development.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Objective Banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-5 rounded-2xl p-5 bg-primary/8 border border-primary/20 flex items-center gap-3"
        >
          <Users className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-foreground leading-relaxed">
            Our aim is to educate students academically <span className="font-medium">and</span> develop their confidence, communication, and overall personality for a successful future.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
