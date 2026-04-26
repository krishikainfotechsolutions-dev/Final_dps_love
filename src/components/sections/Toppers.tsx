import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  return (
    <section id="toppers" className="relative py-24 scroll-mt-24 bg-gradient-to-br from-primary/5 via-transparent to-gold/10">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Hall of Fame" title="Our shining toppers" subtitle="Celebrating brilliance — students who dared, dreamt and delivered." />
        <motion.div variants={stagger(0.05, 0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toppers.map((t: any) => (
            <motion.div key={t.id} variants={fadeUp} className="relative rounded-3xl p-6 glass shadow-card overflow-hidden hover-lift group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/20 rounded-full blur-3xl group-hover:bg-gold/40 transition-colors" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gold/60">
                    <img src={t.photo} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
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
    </section>
  );
}
