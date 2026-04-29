import { motion, useReducedMotion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, viewportOnce } from "@/lib/motion";
import campusBg from "@/assets/campus-1.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const stats = [
  { icon: GraduationCap, value: "34+", label: "Years" },
  { icon: Users, value: "560+", label: "Students" },
  { icon: BookOpen, value: "18+", label: "Faculty" },
  { icon: Award, value: "50+", label: "Awards" },
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
      <div className="container mx-auto px-4 relative">
        <SectionHeader
          eyebrow="About Us"
          title="A school where every child shines"
          subtitle="We blend academic rigour with creativity, character and care."
        />

        {/* Two-column: single hero image + text. Calm, premium, minimal. */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mt-2">
          {/* Image — one statement photo with subtle gold accent frame */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold/30 shadow-elegant">
              <img
                src={campusBg}
                alt="Dehradoon Public School campus"
                className="w-full h-[320px] sm:h-[420px] object-cover"
                loading="lazy"
                decoding="async"
              />
              {!lowMotion && (
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent pointer-events-none" />
              )}
            </div>
            {/* Floating glass badge — single subtle glassmorphism touch */}
            <div className="absolute -bottom-5 left-5 sm:left-8 glass rounded-2xl px-5 py-3 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                Established
              </p>
              <p className="text-xl font-bold text-primary leading-none mt-1">
                1992
              </p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="order-1 lg:order-2"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Story
            </p>
            <h3 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
              Nurturing curious minds &{" "}
              <span className="text-gradient-primary">kind hearts</span>
            </h3>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-primary/40 via-gold/50 to-transparent" />
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Dehradoon Public Senior Secondary School, established in 1992, stands as a symbol of quality education, discipline, and excellence. Since its inception, the school has been dedicated to nurturing young minds and shaping them into responsible and capable individuals. With a strong foundation built over decades, the institution has consistently focused on academic brilliance along with the overall development of students.
<br /><br />
The school believes in providing a balanced education that integrates traditional values with modern teaching methodologies. Over the years, Dehradoon Public Senior Secondary School has earned a reputation for maintaining high standards in education, discipline, and co-curricular activities. The aim is not only to educate students but also to empower them with confidence, creativity, and strong moral character to face the challenges of the modern world.
            </p>

            {/* Compact glass stat strip — one element, no per-card animation */}
            <div className="mt-8 grid grid-cols-4 rounded-2xl border border-gold/30 glass overflow-hidden">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-3 py-4 text-center ${
                    i < stats.length - 1 ? "border-r border-gold/20" : ""
                  }`}
                >
                  <s.icon className="w-4 h-4 mx-auto text-gold mb-1.5" />
                  <p className="text-lg sm:text-2xl font-bold text-primary leading-none">
                    {s.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision — minimal cards, one accent each */}
        <div className="grid md:grid-cols-2 gap-5 mt-16">
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="group rounded-2xl p-6 md:p-8 bg-card border hover-lift"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">
              Our Mission
            </p>
            <h4 className="text-lg font-bold mb-2 text-foreground">
              Inspire, empower, elevate
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To provide a safe, joyful and intellectually stimulating environment where children grow into confident learners and responsible citizens of tomorrow.
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-primary/30 via-gold/40 to-transparent" />
          </motion.article>

          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="group rounded-2xl p-6 md:p-8 bg-card border border-gold/30 hover-lift"
          >
            <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center mb-4">
              <Award className="w-4 h-4 text-foreground" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 mb-2">
              Our Vision
            </p>
            <h4 className="text-lg font-bold mb-2 text-foreground">
              Every child, a unique star
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To nurture individuality, foster innovation, and prepare every student to thrive in a rapidly evolving world.
            </p>
            <div className="mt-5 h-px bg-gradient-to-r from-gold/40 via-primary/30 to-transparent" />
          </motion.article>
        </div>
      </div>
    </section>
  );
}
