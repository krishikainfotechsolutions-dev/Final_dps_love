import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { cldOptimized } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Gallery() {
  const { gallery } = useContent();
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number>(-1);
  const categories = useMemo(() => ["All", ...Array.from(new Set(gallery.map((g: any) => g.category)))], [gallery]);
  const filtered = useMemo(() => filter === "All" ? gallery : gallery.filter((g: any) => g.category === filter), [filter, gallery]);
  const slides = filtered.map((g: any) => ({ src: cldOptimized(g.url, 1600), alt: g.title }));
  return (
    <section id="gallery" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Memories" title="Glimpses of school life" subtitle="A vibrant tapestry of learning, festivals, sports and sparkle." />
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all border", filter === c ? "bg-primary text-primary-foreground border-primary shadow-card" : "bg-card border-border text-foreground hover:border-primary/40")}>{c}</button>
          ))}
        </div>
        <motion.div variants={stagger(0.04, 0.06)} initial="hidden" whileInView="show" viewport={viewportOnce} className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {filtered.map((g: any, i: number) => (
            <motion.button key={g.id} variants={fadeUp} onClick={() => setOpen(i)} className="group block w-full break-inside-avoid rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all relative">
              <img src={cldOptimized(g.url, 600)} alt={g.title} loading="lazy" className="w-full h-auto transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-[10px] text-gold uppercase tracking-wider">{g.category}</p>
                  <p className="text-sm font-semibold text-white">{g.title}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
        <Lightbox open={open >= 0} index={open >= 0 ? open : 0} close={() => setOpen(-1)} slides={slides} />
      </div>
    </section>
  );
}
