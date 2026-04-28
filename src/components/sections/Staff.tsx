import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 8;

function categorize(role: string) {
  const r = role.toLowerCase();
  if (r.includes("principal") || r.includes("head") || r.includes("hod") || r.includes("coordinator")) return "Leadership";
  if (r.includes("math") || r.includes("phys") || r.includes("chem") || r.includes("bio") || r.includes("science") || r.includes("computer") || r.includes("it")) return "Science & Maths";
  if (r.includes("english") || r.includes("hindi") || r.includes("social") || r.includes("history") || r.includes("geog") || r.includes("econ") || r.includes("commerce") || r.includes("account")) return "Humanities";
  if (r.includes("art") || r.includes("music") || r.includes("sport") || r.includes("yoga") || r.includes("wellness")) return "Arts & Sports";
  return "Support";
}

export default function Staff() {
  const { staff } = useContent();
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<any | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(staff.map((s: any) => categorize(s.role)));
    return ["All", ...Array.from(set)];
  }, [staff]);

  const filtered = useMemo(() => {
    return staff.filter((s: any) => {
      const matchCat = filter === "All" || categorize(s.role) === filter;
      const q = query.trim().toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.subjects?.some((x: string) => x.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [staff, filter, query]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section id="staff" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-accent/30 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Our People"
          title={`Meet our ${staff.length}+ faculty members`}
          subtitle="Mentors, coaches and lifelong learners — committed to every child's growth."
        />

        {/* Filters + search */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setFilter(c); setShowAll(false); }}
                className={cn(
                  "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border",
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary shadow-card"
                    : "bg-card border-border text-foreground hover:border-primary/40",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="max-w-md mx-auto w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowAll(true); }}
              placeholder="Search by name, role or subject…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition"
            />
          </div>
        </div>

        {/* Compact responsive grid */}
        <motion.div
          key={`${filter}-${query}-${showAll}`}
          variants={stagger(0.02, 0.04)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {visible.map((s: any) => (
            <motion.button
              key={s.id}
              variants={fadeUp}
              onClick={() => setActive(s)}
              className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all aspect-[3/4] text-left"
            >
              <img
                src={s.photo}
                alt={s.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                style={{
                  objectFit: (s._imgFit ?? 'cover') as any,
                  objectPosition: s._imgPosition ?? 'center center',
                  transform: s._imgZoom && s._imgZoom !== 1 ? `scale(${s._imgZoom})` : undefined,
                  transformOrigin: s._imgPosition ?? 'center center',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-primary-foreground">
                <p className="text-[10px] uppercase tracking-wider text-gold font-semibold line-clamp-1">{s.role}</p>
                <h3 className="text-sm font-bold leading-tight line-clamp-2">{s.name}</h3>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">No faculty matches your search.</p>
        )}

        {filtered.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow-card hover:shadow-elegant transition-all"
            >
              {showAll ? (<>Show less <ChevronUp className="w-4 h-4" /></>) : (<>View all {filtered.length} <ChevronDown className="w-4 h-4" /></>)}
            </button>
          </div>
        )}

        {/* Detail modal */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-3xl overflow-hidden max-w-md w-full shadow-elegant"
              >
                <div className="relative aspect-square">
                  <img
                    src={active.photo}
                    alt={active.name}
                    className="w-full h-full"
                    style={{
                      objectFit: (active._imgFit ?? 'cover') as any,
                      objectPosition: active._imgPosition ?? 'center center',
                      transform: active._imgZoom && active._imgZoom !== 1 ? `scale(${active._imgZoom})` : undefined,
                      transformOrigin: active._imgPosition ?? 'center center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
                  <button onClick={() => setActive(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
                    <p className="text-xs uppercase tracking-widest text-gold font-semibold">{active.role}</p>
                    <h3 className="text-2xl font-bold">{active.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground">{active.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.subjects?.map((sub: string) => (
                      <span key={sub} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{sub}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}