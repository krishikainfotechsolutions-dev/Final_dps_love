import { motion } from "framer-motion";
import { Bell, Pin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Notices() {
  const { notices } = useContent();
  const marqueeItems = [...notices, ...notices];
  return (
    <section id="notices" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-muted/40 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Latest Updates" title="Notices & Announcements" />
        <div className="relative overflow-hidden mb-10 rounded-2xl border border-gold/30 bg-card py-3">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent z-10" />
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {marqueeItems.map((n: any, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4 text-gold shrink-0" />
                <span className="font-semibold text-primary">{n.title}</span>
                <span className="text-muted-foreground">— {n.body}</span>
              </span>
            ))}
          </div>
        </div>
        <motion.div variants={stagger(0.05, 0.08)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notices.slice(0, 6).map((n: any) => (
            <motion.article key={n.id} variants={fadeUp} className="group relative rounded-2xl p-6 bg-card border hover-lift">
              {n.pinned && (
                <span className="absolute -top-2 -right-2 bg-gold text-gold-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-card">
                  <Pin className="w-3 h-3" /> PINNED
                </span>
              )}
              <p className="text-xs text-muted-foreground mb-2">{new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              <h3 className="font-semibold text-lg text-primary group-hover:text-primary-glow transition-colors">{n.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{n.body}</p>
              <div className="mt-4 h-px bg-gradient-to-r from-primary/30 via-gold/40 to-transparent" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}