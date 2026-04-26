import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/lib/motion";
import campus1 from "@/assets/campus-1.jpg";
import campus2 from "@/assets/campus-2.jpg";
import campus3 from "@/assets/campus-3.jpg";

const stats = [
  { icon: GraduationCap, value: "20+", label: "Years of Excellence" },
  { icon: Users, value: "1,200+", label: "Happy Students" },
  { icon: BookOpen, value: "60+", label: "Expert Faculty" },
  { icon: Award, value: "50+", label: "Awards Won" },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 scroll-mt-24 overflow-hidden bg-background">
      {/* Subtle premium accents */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(at_15%_10%,hsl(var(--primary)/0.06),transparent_50%),radial-gradient(at_85%_90%,hsl(var(--gold)/0.07),transparent_50%)]" />
      <div className="container mx-auto px-4 relative">
        <SectionHeader eyebrow="About Us" title="A school where every child shines" subtitle="We blend academic rigour with creativity, character and care." />

        {/* Collage + text */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mt-4">
          {/* Photo collage */}
          <motion.div
            variants={stagger(0.12, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative grid grid-cols-6 grid-rows-6 gap-3 sm:gap-4 h-[420px] sm:h-[520px] order-2 lg:order-1"
          >
            <motion.div variants={scaleIn} className="col-span-4 row-span-4 rounded-3xl overflow-hidden shadow-elegant ring-1 ring-border">
              <img src={campus1} alt="School campus" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </motion.div>
            <motion.div variants={scaleIn} className="col-span-2 row-span-3 rounded-3xl overflow-hidden shadow-card ring-1 ring-border">
              <img src={campus2} alt="Students learning" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </motion.div>
            <motion.div variants={scaleIn} className="col-span-3 row-span-2 rounded-3xl overflow-hidden shadow-card ring-1 ring-border">
              <img src={campus3} alt="School activities" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </motion.div>
            <motion.div
              variants={scaleIn}
              className="col-span-3 row-span-3 rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-5 sm:p-6 flex flex-col justify-between shadow-elegant"
            >
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gold">Est. 2003</p>
              <div>
                <p className="text-3xl sm:text-5xl font-bold leading-none">20+</p>
                <p className="text-xs sm:text-sm opacity-90 mt-1">Years shaping young minds</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text + stats */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Story</p>
            <h3 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Nurturing <span className="text-gradient-primary">curious minds</span> & <span className="text-gradient-gold">kind hearts</span>
            </h3>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              At Dehradoon Public Senior Secondary School, we believe education is more than academics — it's the art of awakening potential. For over two decades, we have created a safe, joyful environment where every child is seen, heard, and inspired to thrive.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover-lift">
                  <s.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision — refined minimal cards */}
        <div className="grid md:grid-cols-2 gap-5 mt-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 border border-border bg-card hover-lift">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">Our Mission</p>
            <h4 className="text-xl font-bold mb-2">Inspire, empower, elevate</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">To provide a safe, joyful and intellectually stimulating environment where children grow into confident learners and responsible citizens of tomorrow.</p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 border border-gold/30 bg-gradient-to-br from-accent/40 to-card hover-lift">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 mb-2">Our Vision</p>
            <h4 className="text-xl font-bold mb-2">Every child, a unique star</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">To nurture individuality, foster innovation, and prepare every student to thrive in a rapidly evolving world.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}