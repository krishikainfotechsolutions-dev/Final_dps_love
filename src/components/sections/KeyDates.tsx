import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { viewportOnce } from "@/lib/motion";

export default function KeyDates() {
  const { keyDates } = useContent();
  const sorted = [...keyDates].sort((a: any, b: any) => +new Date(a.date) - +new Date(b.date));
  return (
    <section id="key-dates" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Mark Your Calendar" title="Important dates this year" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={viewportOnce} transition={{ duration: 1.2, ease: "easeInOut" }} className="absolute left-4 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-primary via-gold to-primary" />
          <ul className="space-y-6">
            {sorted.map((k: any) => (
              <motion.li key={k.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportOnce} transition={{ duration: 0.6 }} className="relative pl-12">
                <div className="absolute left-0 top-1.5 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shadow-card ring-4 ring-background">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="rounded-2xl p-5 bg-card border shadow-card hover-lift">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold/20 text-primary mb-2">{k.type}</span>
                  <h3 className="font-semibold text-primary">{k.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(k.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  <p className="text-sm text-muted-foreground mt-2">{k.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
