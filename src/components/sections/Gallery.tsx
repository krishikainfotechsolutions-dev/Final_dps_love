import { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { cldOptimized } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getFirstImage(g: any): string {
  if (Array.isArray(g.images) && g.images.length > 0) return g.images[0];
  return g.url ?? "";
}

function getSlides(g: any): { src: string; alt: string }[] {
  if (Array.isArray(g.images) && g.images.length > 0) {
    return g.images.map((url: string) => ({ src: url, alt: g.title }));
  }
  return [{ src: g.url ?? "", alt: g.title }];
}

export default function Gallery() {
  const { gallery } = useContent();
  const [filter, setFilter] = useState<string>("All");
  const [lightbox, setLightbox] = useState<{ slides: { src: string; alt: string }[]; index: number } | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(gallery.map((g: any) => g.category)))],
    [gallery]
  );

  const filtered = useMemo(
    () => (filter === "All" ? gallery : gallery.filter((g: any) => g.category === filter)),
    [filter, gallery]
  );

  const openLightbox = (g: any) => {
    setLightbox({ slides: getSlides(g), index: 0 });
  };

  const scrollTabs = (dir: "left" | "right") => {
    tabsRef.current?.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  };

  return (
    <section id="gallery" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Memories" title="Glimpses of school life" subtitle="A vibrant tapestry of learning, festivals, sports and sparkle." />

        {/* Scrollable category tabs — like calendar */}
        <div className="flex items-center gap-2 mb-8">
          {/* Left arrow */}
          <button
            onClick={() => scrollTabs("left")}
            className="shrink-0 w-8 h-8 rounded-full border border-primary/20 bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Tab strip */}
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap",
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary shadow-card"
                    : "bg-card border-border text-foreground hover:border-primary/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollTabs("right")}
            className="shrink-0 w-8 h-8 rounded-full border border-primary/20 bg-white flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Count badge */}
        <p className="text-xs text-muted-foreground text-center mb-6">
          Showing <span className="font-semibold text-primary">{filtered.length}</span> {filter === "All" ? "photos" : `photos in "${filter}"`}
        </p>

        <motion.div
          key={filter}
          variants={stagger(0.04, 0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 gap-5 [&>*]:mb-5"
        >
          {filtered.map((g: any) => {
            const thumb = getFirstImage(g);
            const count = Array.isArray(g.images) ? g.images.length : 1;
            return (
              <motion.button
                key={g.id}
                variants={fadeUp}
                onClick={() => openLightbox(g)}
                className="group block w-full break-inside-avoid rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all relative"
              >
                <img
                  src={cldOptimized(thumb, 900)}
                  alt={g.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {count > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    {count} 📷
                  </div>
                )}
                {/* Title — always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-4">
                  <div>
                    <p className="text-[10px] text-gold uppercase tracking-wider">{g.category}</p>
                    <p className="text-sm font-semibold text-white">{g.title}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No photos in this category yet.</p>
        )}

        {lightbox && (
          <Lightbox
            open={true}
            index={lightbox.index}
            close={() => setLightbox(null)}
            slides={lightbox.slides}
            styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
            carousel={{ imageFit: "contain", preload: 2 }}
          />
        )}
      </div>
    </section>
  );
}
