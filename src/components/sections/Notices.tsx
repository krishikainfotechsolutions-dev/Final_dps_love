import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ExternalLink, Pin, ChevronDown } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Pinned", "Recent"];

export default function Notices() {
  const { notices } = useContent();
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const marqueeItems = [...notices, ...notices];

  const filtered = useMemo(() => {
    let list = [...notices];
    if (filter === "Pinned") {
      list = list.filter((n: any) => n.pinned);
    } else if (filter === "Recent") {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((n: any) => +new Date(n.date) >= cutoff);
    }
    list.sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return +new Date(b.date) - +new Date(a.date);
    });
    return list;
  }, [notices, filter]);

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
      id="notices"
      className="relative py-24 scroll-mt-24"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(44 94% 97%) 40%, hsl(145 30% 97%) 100%)",
        borderTop: "1px solid hsl(44 60% 88%)",
        borderBottom: "1px solid hsl(145 30% 88%)",
      }}
    >
      {/* Angled stripe accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(145 83% 26%), hsl(44 94% 48%), hsl(145 83% 26%))",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader eyebrow="Latest Updates" title="Notices & Announcements" />

        {/* Marquee ticker */}
        <div className="relative overflow-hidden mb-10 rounded-2xl border border-gold/30 bg-white/80 backdrop-blur-sm py-3 shadow-card">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
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

        {/* --- Scrollable Dropdown Filter Menu --- */}
        <div className="flex justify-center mb-8" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all shadow-sm",
                "bg-white border-gold/40 text-primary hover:border-gold hover:shadow-card"
              )}
            >
              {filter === "Pinned" && <Pin className="w-3.5 h-3.5" />}
              {filter === "All" ? "All Notices" : filter}
              {filter === "Pinned" && (
                <span className="text-[10px] bg-gold/20 text-primary rounded-full px-1.5 py-0.5">
                  {notices.filter((n: any) => n.pinned).length}
                </span>
              )}
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
                  className="absolute left-0 mt-2 w-52 bg-white border-2 border-gold/20 rounded-xl shadow-card overflow-hidden z-50 origin-top"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {FILTERS.map((f) => {
                    const isActive = filter === f;
                    return (
                      <button
                        key={f}
                        onClick={() => {
                          setFilter(f);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border/40 last:border-b-0",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent/50"
                        )}
                      >
                        {f === "Pinned" && (
                          <Pin className={cn("w-3.5 h-3.5", isActive ? "text-white/80" : "text-gold")} />
                        )}
                        <span className="flex-1">{f === "All" ? "All Notices" : f}</span>
                        {f === "Pinned" && (
                          <span
                            className={cn(
                              "text-[10px] rounded-full px-1.5 py-0.5",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-gold/20 text-primary"
                            )}
                          >
                            {notices.filter((n: any) => n.pinned).length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                className="group relative rounded-2xl p-6 bg-white border border-primary/10 hover-lift flex flex-col shadow-card"
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
