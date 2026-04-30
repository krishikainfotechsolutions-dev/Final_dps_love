import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ExternalLink, ChevronDown } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<string, { badge: string; dot: string }> = {
  Academic: { badge: "bg-blue-100 text-blue-700 border border-blue-200",  dot: "bg-blue-400" },
  Exam:     { badge: "bg-red-100 text-red-700 border border-red-200",     dot: "bg-red-400" },
  Holiday:  { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400" },
  Event:    { badge: "bg-purple-100 text-purple-700 border border-purple-200", dot: "bg-purple-400" },
};

export default function KeyDates() {
  const { keyDates } = useContent();
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLUListElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section
      id="key-dates"
      className="relative py-24 scroll-mt-24"
      style={{
        background:
          "linear-gradient(160deg, hsl(145 83% 97%) 0%, hsl(44 94% 96%) 50%, hsl(145 83% 95%) 100%)",
        borderTop: "1px solid hsl(145 40% 88%)",
        borderBottom: "1px solid hsl(145 40% 88%)",
      }}
    >
      {/* Subtle decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(145 83% 26%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader eyebrow="Mark Your Calendar" title="Important dates this year" />

        {/* --- Scrollable Dropdown Filter Menu --- */}
        <div className="flex justify-center mb-10" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all shadow-sm",
                "bg-white border-primary/30 text-primary hover:border-primary hover:shadow-card"
              )}
            >
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  filter === "All"
                    ? "bg-primary"
                    : (TYPE_COLORS[filter]?.dot ?? "bg-primary")
                )}
              />
              {filter === "All" ? "All Categories" : filter}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 mt-2 w-56 bg-white border-2 border-primary/15 rounded-xl shadow-card overflow-hidden z-50 origin-top"
                  style={{ maxHeight: "220px", overflowY: "auto" }}
                >
                  {types.map((t) => {
                    const colors = TYPE_COLORS[t];
                    const isActive = filter === t;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setFilter(t);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border/50 last:border-b-0",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted/60"
                        )}
                      >
                        <span
                          className={cn(
                            "w-2.5 h-2.5 rounded-full flex-shrink-0",
                            isActive
                              ? "bg-white/70"
                              : (colors?.dot ?? "bg-primary")
                          )}
                        />
                        {t === "All" ? "All Categories" : t}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Two-column layout: sidebar scroll list + main detail */}
        <div className="flex gap-6 max-w-5xl mx-auto">

          {/* Left scrollable sidebar list */}
          <div
            className="hidden md:block w-64 flex-shrink-0 rounded-2xl border border-primary/15 bg-white shadow-card overflow-hidden"
            style={{ height: "520px" }}
          >
            <div className="px-4 py-3 border-b border-primary/10 bg-primary/5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {filtered.length} Date{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ul
              ref={scrollRef}
              className="overflow-y-auto"
              style={{ height: "calc(100% - 44px)" }}
            >
              {filtered.map((k: any) => {
                const colors = TYPE_COLORS[k.type];
                return (
                  <li key={k.id}>
                    <a
                      href={`#kd-${k.id}`}
                      className="flex items-start gap-3 px-4 py-3 border-b border-border/40 hover:bg-primary/5 transition-colors group"
                    >
                      <span
                        className={cn(
                          "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                          colors?.dot ?? "bg-primary"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-primary leading-snug line-clamp-2 group-hover:text-primary-glow transition-colors">
                          {k.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(k.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right timeline */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute left-4 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-primary via-gold to-primary"
            />
            <ul
              className="space-y-6 overflow-y-auto pr-1"
              style={{ maxHeight: "520px" }}
            >
              {filtered.map((k: any, i: number) => {
                const colors = TYPE_COLORS[k.type];
                return (
                  <motion.li
                    id={`kd-${k.id}`}
                    key={k.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-1.5 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center shadow-card ring-4 ring-background">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="rounded-2xl p-5 bg-white border border-primary/10 shadow-card hover-lift">
                      <span
                        className={cn(
                          "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2",
                          colors?.badge ?? "bg-gold/20 text-primary border border-gold/30"
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
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
