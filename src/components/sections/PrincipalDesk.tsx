import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { PRINCIPAL } from "@/lib/seed";

export default function PrincipalDesk() {
  return (
    <section id="principal" className="relative py-24 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-gold/10" />
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Leadership" title="From the Principal's Desk" subtitle="A note from the head of our school family." />
        <div className="grid md:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="md:col-span-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/20 to-gold/30 blur-2xl" />
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden ring-4 ring-gold/50 shadow-elegant">
                <img src={PRINCIPAL.photo} alt={PRINCIPAL.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-card whitespace-nowrap">
                {PRINCIPAL.title}
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="md:col-span-3 relative glass rounded-3xl p-6 sm:p-8 shadow-card"
          >
            <Quote className="absolute -top-3 -left-3 w-12 h-12 text-gold/40 rotate-180" />
            <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
              {PRINCIPAL.message}
            </p>
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-base font-bold text-primary">{PRINCIPAL.name}</p>
              <p className="text-xs text-muted-foreground">{PRINCIPAL.title}, Dehradoon Public Sr. Sec. School</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
