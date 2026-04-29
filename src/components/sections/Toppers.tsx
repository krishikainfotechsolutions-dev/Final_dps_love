import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const start = performance.now(); const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref}>{n.toFixed(1)}</span>;
}

export default function Toppers() {
  const { toppers } = useContent();

  // Group toppers by class, then sort each group by rank ascending (1 → highest rank)
  const groupedToppers = useMemo(() => {
    const groups: Record<string, any[]> = {};
    toppers.forEach((t: any) => {
      if (!groups[t.class]) groups[t.class] = [];
      groups[t.class].push(t);
    });
    // Sort each group by rank ascending (rank 1 first, i.e. decreasing performance shown top-down)
    Object.keys(groups).forEach((cls) => {
      groups[cls].sort((a, b) => a.rank - b.rank);
    });
    // Sort class names alphabetically for consistent ordering
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [toppers]);

  return (
    <section id="toppers" className="relative py-24 scroll-mt-24 bg-gradient-to-br from-primary/5 via-transparent to-gold/10">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Hall of Fame" title="Our shining toppers" subtitle="Celebrating brilliance — students who dared, dreamt and delivered." />

        {groupedToppers.map(([className, classToppers]) => (
          <div key={className} className="mb-12">
            {/* Class heading */}
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-gold" />
              <h2 className="text-xl font-bold text-primary">{className}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
            </div>

            <motion.div variants={stagger(0.05, 0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classToppers.map((t: any) => (
                <motion.div key={t.id} variants={fadeUp} className="relative rounded-3xl p-6 glass shadow-card overflow-hidden hover-lift group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/20 rounded-full blur-3xl group-hover:bg-gold/40 transition-colors" />
                  <div className="relative flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gold/60">
                        <img
                          src={t.photo}
                          alt={t.name}
                          loading="lazy"
                          className="w-full h-full"
                          style={{
                            objectFit: (t._imgFit ?? 'cover') as any,
                            objectPosition: t._imgPosition ?? 'center center',
                            transform: t._imgZoom && t._imgZoom !== 1 ? `scale(${t._imgZoom})` : undefined,
                            transformOrigin: t._imgPosition ?? 'center center',
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-gold to-[hsl(44_94%_42%)] text-gold-foreground text-xs font-bold flex items-center justify-center shadow-card">#{t.rank}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.class} • {t.year}</p>
                    </div>
                    <Trophy className="ml-auto w-5 h-5 text-gold" />
                  </div>
                  <div className="relative mt-6">
                    <p className="text-4xl font-bold text-gradient-primary"><Counter value={t.percentage} />%</p>
                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.percentage}%` }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-gradient-to-r from-primary to-gold" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
