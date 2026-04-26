import { motion, useReducedMotion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/lib/motion";
import campusBg from "@/assets/campus-1.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const stats = [
  { icon: GraduationCap, value: "20+", label: "Years of Excellence" },
  { icon: Users, value: "1,200+", label: "Happy Students" },
  { icon: BookOpen, value: "60+", label: "Expert Faculty" },
  { icon: Award, value: "50+", label: "Awards Won" },
];

export default function About() {
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const lowMotion = isMobile || prefersReduced;

  return (
    <section
      id="about"
      className="relative py-24 scroll-mt-24 overflow-hidden bg-gradient-to-b from-transparent via-muted/40 to-transparent"
    >
      {/* Subtle brand-tinted backdrop (image only on desktop) */}
      <div className="absolute inset-0 -z-10">
        {!lowMotion && (
          <img
            src={campusBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-40"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(at_20%_20%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(at_80%_80%,hsl(var(--gold)/0.12),transparent_55%)]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <SectionHeader
          eyebrow="About Us"
          title="A school where every child shines"
          subtitle="We blend academic rigour with creativity, character and care."
        />

        {/* Stats — match Notices card pattern: rounded-2xl, bg-card, border, gold accent hairline */}
        <motion.div
          variants={stagger(lowMotion ? 0 : 0.08, lowMotion ? 0.04 : 0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={scaleIn}
              className="group relative rounded-2xl p-6 bg-card border hover-lift text-center"
            >
              <s.icon className="w-7 h-7 mx-auto text-gold mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
              <div className="mt-4 h-px bg-gradient-to-r from-primary/30 via-gold/40 to-transparent" />
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision — Mission keeps brand gradient (consistent w/ "feature" cards), Vision uses card+border+gold accent */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="group relative rounded-2xl p-6 md:p-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border border-gold/30 shadow-elegant hover-lift"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              <BookOpen className="w-4 h-4" /> Our Mission
            </span>
            <h3 className="text-2xl font-bold mb-3">Inspire, empower, and elevate</h3>
            <p className="opacity-90 text-sm md:text-base">
              To provide a safe, joyful and intellectually stimulating environment where children grow into confident learners and responsible citizens of tomorrow.
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-gold/60 via-gold/30 to-transparent" />
          </motion.article>

          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="group relative rounded-2xl p-6 md:p-8 bg-card border border-gold/30 hover-lift"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <Award className="w-4 h-4 text-gold" /> Our Vision
            </span>
            <h3 className="text-2xl font-bold mb-3 text-primary">Every child, a unique star</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              To nurture individuality, foster innovation, and prepare every student to thrive in a rapidly evolving world.
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-primary/30 via-gold/40 to-transparent" />
          </motion.article>
        </div>
      </div>
    </section>
  );
}
