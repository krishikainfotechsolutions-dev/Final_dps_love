import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, ExternalLink, Pin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Pinned", "Recent"];

export default function Notices() {
  const { notices } = useContent();
  const [filter, setFilter] = useState("All");

  const marqueeItems = [...notices, ...notices];

  const filtered = useMemo(() => {
    let list = [...notices];

    if (filter === "Pinned") {
      list = list.filter((n: any) => n.pinned);
    } else if (filter === "Recent") {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((n: any) => +new Date(n.date) >= cutoff);
    }

    // Pinned always on top
    list.sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return +new Date(b.date) - +new Date(a.date);
    });

    return list;
  }, [notices, filter]);

  return (
    <section
      id="notices"
      className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-muted/40 to-transparent"
    >
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Latest Updates" title="Notices & Announcements" />

        {/* Marquee ticker */}
        <div className="relative overflow-hidden mb-10 rounded-2xl border border-gold/30 bg-card py-3">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card to-transparent z-10" />
          <div className="flex gap-10 animate-marquee-fast whitespace-nowrap">
            {marqueeItems.map((n: any, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4 text-gold shrink-0" />
                <span className="font-semibold text-primary">{n.title}</span>
                <span className="text-muted-foreground">— {n.body}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm border font-medium transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {f === "Pinned" && <Pin className="w-3 h-3" />}
              {f}
              {f === "Pinned" && (
                <span className="text-[10px] bg-gold/20 text-primary rounded-full px-1.5 py-0.5">
                  {notices.filter((n: any) => n.pinned).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No notices found.</p>
        ) : (
          <motion.div
            key={filter}
            variants={stagger(0.05, 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((n: any) => (
              <motion.article
                key={n.id}
                variants={fadeUp}
                className="group relative rounded-2xl p-6 bg-card border hover-lift flex flex-col"
              >
                {n.pinned && (
                  <span className="absolute -top-2 -right-2 bg-gold text-gold-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-card">
                    <Pin className="w-3 h-3" /> PINNED
                  </span>
                )}
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(n.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="font-semibold text-lg text-primary group-hover:text-primary-glow transition-colors">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{n.body}</p>
                <div className="mt-4 h-px bg-gradient-to-r from-primary/30 via-gold/40 to-transparent" />
                {n.link && n.link.trim() !== "" && (
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-glow transition-colors self-start"
                  >
                    Read More <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
