import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import campusHero from "@/assets/campus-2.jpg";
import { SCHOOL } from "@/lib/seed";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden text-primary-foreground py-24 md:py-20">
      {/* Full-bleed campus photo background */}
      <div className="absolute inset-0 -z-10">
        <motion.img
          src={campusHero}
          alt="Dehradoon Public School campus"
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Premium gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(150_60%_8%/0.85)] via-[hsl(145_60%_12%/0.7)] to-[hsl(150_70%_6%/0.95)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_20%_30%,hsl(var(--primary)/0.35),transparent_55%),radial-gradient(at_80%_80%,hsl(var(--gold)/0.25),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>
      {/* Subtle floating accents */}
      <motion.div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gold/10 blur-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] rounded-full bg-primary-glow/15 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-gold/60 shadow-glow">
              <img src={logo} alt="DPS Kanpur" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-5 sm:mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-xs md:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 text-gold" /> Welcome to {SCHOOL.shortName}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }} className="mt-4 sm:mt-6 text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Dehradoon Public<br />
          <span className="text-gradient-gold">Senior Secondary School</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto opacity-90 px-2">
          {SCHOOL.tagline} — shaping confident, curious and compassionate learners in the heart of {SCHOOL.city}.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button size="lg" onClick={() => go("about")} className="bg-gold text-gold-foreground hover:opacity-90 shadow-glow group">
            Explore School <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => go("contact")} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            Contact Us
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute left-1/2 -translate-x-1/2 bottom-6 hidden md:flex flex-col items-center gap-2 opacity-70">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}