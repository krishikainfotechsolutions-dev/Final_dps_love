import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useMemo } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import { SCHOOL } from "@/lib/seed";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const prefersReduced = useReducedMotion();
  const lowMotion = isMobile || prefersReduced;

  // Parallax — disabled on mobile / reduced motion to save scroll cost
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], lowMotion ? [0, 0] : [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], lowMotion ? [1, 1] : [1, 0]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Memoize transitions so they don't re-create each render
  const fade = useMemo(
    () => ({
      initial: { opacity: 0, y: lowMotion ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
    }),
    [lowMotion]
  );

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-hero text-primary-foreground py-24 md:py-20"
    >
      {/* Decorative blurred blobs — heavy on mobile GPUs, render only on >= sm */}
      {!lowMotion && (
        <>
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/20 blur-3xl will-change-transform"
            style={{ transform: "translateZ(0)" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary-glow/30 blur-3xl will-change-transform"
            style={{ transform: "translateZ(0)" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      {/* Static dot pattern (no JS animation) */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        style={lowMotion ? undefined : { y, opacity }}
        className="container mx-auto px-4 relative z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: lowMotion ? 1 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: lowMotion ? 0.4 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div className="relative">
            {!lowMotion && (
              <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl animate-pulse" />
            )}
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-gold/60 shadow-glow">
              <img
                src={logo}
                alt="DPS Kanpur"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fade}
          transition={{ delay: lowMotion ? 0 : 0.15, duration: 0.5 }}
          className="mt-5 sm:mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30"
        >
          <Sparkles className="w-3.5 h-3.5" /> Welcome to {SCHOOL.shortName}
        </motion.div>

        <motion.h1
          {...fade}
          transition={{ delay: lowMotion ? 0.05 : 0.25, duration: 0.6 }}
          className="mt-4 sm:mt-6 text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Dehradoon Public<br />
          <span className="text-gradient-gold">Senior Secondary School</span>
        </motion.h1>

        <motion.p
          {...fade}
          transition={{ delay: lowMotion ? 0.1 : 0.4, duration: 0.6 }}
          className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto opacity-90 px-2"
        >
          {SCHOOL.tagline} — shaping confident, curious and compassionate learners in the heart of {SCHOOL.city}.
        </motion.p>

        {/* Brand accent hairline — matches gradient divider used across cards */}
        <div className="mx-auto mt-6 sm:mt-8 h-px w-40 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <motion.div
          {...fade}
          transition={{ delay: lowMotion ? 0.15 : 0.55, duration: 0.6 }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Button
            size="lg"
            onClick={() => go("about")}
            className="bg-gold text-gold-foreground hover:opacity-90 shadow-glow group border border-gold/40"
          >
            Explore School{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => go("contact")}
            className="bg-white/5 border-gold/40 text-white hover:bg-white/15"
          >
            Contact Us
          </Button>
        </motion.div>

        {!lowMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-6 hidden md:flex flex-col items-center gap-2 opacity-70"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-white to-transparent"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
