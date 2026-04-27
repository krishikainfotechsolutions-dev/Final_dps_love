import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Events() {
  const { events } = useContent();
  const [active, setActive] = useState<any | null>(null);
  const [slide, setSlide] = useState(0);

  const openEvent = (e: any) => { setActive(e); setSlide(0); };
  const images: string[] = active ? (active.images?.length ? active.images : [active.coverImage]) : [];
  const next = () => setSlide((s) => (s + 1) % images.length);
  const prev = () => setSlide((s) => (s - 1 + images.length) % images.length);

  return (
    <section id="events" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="What's Happening" title="Events & Celebrations" subtitle="From cultural festivals to academic milestones — moments that make us proud." />

        <motion.div variants={stagger(0.05, 0.08)} initial="hidden" whileInView="show" viewport={viewportOnce} className="flex gap-5 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory -mx-4 px-4 items-start">
          {events.map((e: any, idx: number) => (
            <motion.button
              key={e.id}
              variants={fadeUp}
              onClick={() => openEvent(e)}
              style={{ marginTop: idx % 2 === 1 ? "2rem" : "0" }}
              className={`group relative shrink-0 snap-start w-[200px] sm:w-[230px] md:w-[260px] aspect-[4/5] rounded-2xl overflow-hidden text-left shadow-card hover:shadow-elegant transition-all ${
                e.title.toLowerCase().includes("celebrat") || e.title.toLowerCase().includes("festival") || e.title.toLowerCase().includes("day") || e.title.toLowerCase().includes("function")
                  ? "ring-2 ring-gold/70 ring-offset-2 ring-offset-background"
                  : ""
              }`}
              whileHover={{ y: -6 }}
            >
              <img src={e.coverImage} alt={e.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-gold text-gold-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">
                {new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </div>
              {e.images?.length > 1 && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <Images className="w-3 h-3" /> {e.images.length}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
                <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-2">{e.title}</h3>
                <p className="mt-1 text-[11px] opacity-80 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" /> {e.location}</p>
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
                <div className="relative aspect-video bg-black">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={slide}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      src={images[slide]} alt="" className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <button onClick={() => setActive(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <X className="w-4 h-4" />
                  </button>
                  {images.length > 1 && (
                    <>
                      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-gold" : "w-1.5 bg-white/60"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(active.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {active.location}</span>
                    {images.length > 1 && (
                      <span className="inline-flex items-center gap-1"><Images className="w-3 h-3" /> {images.length} photos</span>
                    )}
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