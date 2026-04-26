import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, X } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Events() {
  const { events } = useContent();
  const [active, setActive] = useState<any | null>(null);

  return (
    <section id="events" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="What's Happening" title="Events & Celebrations" subtitle="From cultural festivals to academic milestones — moments that make us proud." />

        <motion.div variants={stagger(0.05, 0.08)} initial="hidden" whileInView="show" viewport={viewportOnce} className="flex gap-5 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory -mx-4 px-4">
          {events.map((e: any) => (
            <motion.button
              key={e.id}
              variants={fadeUp}
              onClick={() => setActive(e)}
              className="group relative shrink-0 snap-start w-[280px] md:w-[340px] aspect-[3/4] rounded-3xl overflow-hidden text-left shadow-card hover:shadow-elegant transition-all"
              whileHover={{ y: -6 }}
            >
              <img src={e.coverImage} alt={e.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-gold text-gold-foreground text-[10px] font-bold px-3 py-1.5 rounded-full">
                {new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
                <h3 className="text-xl font-bold leading-tight">{e.title}</h3>
                <p className="mt-1 text-xs opacity-80 flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.location}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl overflow-hidden max-w-2xl w-full shadow-elegant"
              >
                <div className="relative aspect-video">
                  <img src={active.coverImage} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setActive(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(active.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {active.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{active.title}</h3>
                  <p className="mt-3 text-muted-foreground">{active.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}