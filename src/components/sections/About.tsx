import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/lib/motion";
import campusBg from "@/assets/campus-1.jpg";

const stats = [
  { icon: GraduationCap, value: "20+", label: "Years of Excellence" },
  { icon: Users, value: "1,200+", label: "Happy Students" },
  { icon: BookOpen, value: "60+", label: "Expert Faculty" },
  { icon: Award, value: "50+", label: "Awards Won" },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 scroll-mt-24 overflow-hidden">
      {/* School image background with brand gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <img src={campusBg} alt="" aria-hidden="true" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(at_20%_20%,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(at_80%_80%,hsl(var(--gold)/0.18),transparent_55%)]" />
      </div>
      <div className="container mx-auto px-4 relative">
        <SectionHeader eyebrow="About Us" title="A school where every child shines" subtitle="We blend academic rigour with creativity, character and care." />
        <motion.div variants={stagger(0.1, 0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((s) => (
            <motion.div key={s.label} variants={scaleIn} className="glass rounded-2xl p-6 text-center hover-lift">
              <s.icon className="w-8 h-8 mx-auto text-primary mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-gradient-primary">{s.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-2">Our Mission</p>
            <h3 className="text-2xl font-bold mb-3">Inspire, empower, and elevate</h3>
            <p className="opacity-90">To provide a safe, joyful and intellectually stimulating environment where children grow into confident learners and responsible citizens of tomorrow.</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 glass shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Our Vision</p>
            <h3 className="text-2xl font-bold mb-3">Every child, a unique star</h3>
            <p className="text-muted-foreground">To nurture individuality, foster innovation, and prepare every student to thrive in a rapidly evolving world.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}