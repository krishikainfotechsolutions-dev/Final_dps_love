import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700",
  Exam:     "bg-red-100 text-red-700",
  Holiday:  "bg-green-100 text-green-700",
  Event:    "bg-purple-100 text-purple-700",
};

export default function KeyDates() {
  const { keyDates } = useContent();
  const [filter, setFilter] = useState("All");

  const types = useMemo(() => {
    const set = new Set<string>(keyDates.map((k: any) => k.type));
    return ["All", ...Array.from(set)];
  }, [keyDates]);

  const filtered = useMemo(() => {
    const list = filter === "All"
      ? [...keyDates]
      : keyDates.filter((k: any) => k.type === filter);
    return list.sort((a: any, b: any) => +new Date(a.date) - +new Date(b.date));
  }, [keyDates, filter]);

  return (
    <section id="key-dates" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Mark Your Calendar" title="Important dates this year" />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border font-medium transition-colors",
                filter === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-4 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-primary via-gold to-primary"
          />
          <ul className="space-y-6">
            {filtered.map((k: any, i: number) => (
              <motion.li
                key={k.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1.5 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shadow-card ring-4 ring-background">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="rounded-2xl p-5 bg-card border shadow-card hover-lift">
                  <span
                    className={cn(
                      "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2",
                      TYPE_COLORS[k.type] ?? "bg-gold/20 text-primary"
                    )}
                  >
                    {k.type}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-primary">{k.title}</h3>
                    {k.link && k.link.trim() !== "" && (
                      <a
                        href={k.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-glow border border-primary/30 hover:border-primary rounded-full px-2.5 py-0.5 transition-colors"
                      >
                        Details <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(k.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
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
