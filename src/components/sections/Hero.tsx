import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import campusBg from "@/assets/campus-2.jpg";
import { SCHOOL } from "@/lib/seed";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Hero() {
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const lowMotion = isMobile || prefersReduced;

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Single shared entry transition — staggered by delay only
  const enter = (delay = 0) => ({
    initial: { opacity: 0, y: lowMotion ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-hero text-primary-foreground py-24 md:py-20"
    >
      {/* School photo background with brand gradient overlay for legibility */}
      <div className="absolute inset-0 -z-0">
        <img
          src={campusBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain"
          loading="eager"
          decoding="async"
        />
        {/* Brand green/gold gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(150_70%_8%/0.85)] via-[hsl(145_60%_14%/0.75)] to-[hsl(150_70%_6%/0.95)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_20%_30%,hsl(var(--primary)/0.35),transparent_55%),radial-gradient(at_80%_80%,hsl(var(--gold)/0.22),transparent_55%)]" />
      </div>
      {/* Faint dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft vignette for premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,hsl(150_70%_6%/0.65)_100%)] pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        {/* Logo — subtle glass ring, no pulsing halo */}
        <motion.div {...enter(0)} className="flex justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-1 ring-gold/40 shadow-elegant bg-white/10 backdrop-blur-sm p-1.5">
            <img
              src={logo}
              alt={`${SCHOOL.shortName} logo`}
              className="w-full h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* Eyebrow — matches site eyebrow pill */}
        <motion.div
          {...enter(0.1)}
          className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase bg-white/5 backdrop-blur-md text-gold border border-gold/30"
        >
          <Sparkles className="w-3 h-3" /> Welcome to {SCHOOL.shortName}
        </motion.div>

        {/* Headline — refined, lighter weight, single accent word */}
        <motion.h1
          {...enter(0.18)}
          className="mt-5 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Dehradoon Public
          <br />
          <span className="text-gradient-gold font-bold">
            Senior Secondary School
          </span>
        </motion.h1>

        {/* Hairline divider — same accent used across cards */}
        <motion.div
          {...enter(0.26)}
          className="mx-auto mt-7 h-px w-32 bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />

        <motion.p
          {...enter(0.32)}
          className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/80 leading-relaxed px-2"
        >
          {SCHOOL.tagline} — shaping confident, curious and compassionate learners in the heart of {SCHOOL.city}.
        </motion.p>

        <motion.div
          {...enter(0.4)}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => go("about")}
            className="bg-gold text-gold-foreground hover:opacity-90 shadow-glow group"
          >
            Explore School{" "}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => go("contact")}
            className="bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
          >
            Contact Us
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue — desktop only, single static element */}
      {!lowMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      )}
    </section>
  );
}
