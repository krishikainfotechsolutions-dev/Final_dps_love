import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger } from "@/lib/motion";
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

  const categories = useMemo(() => {
    const set = new Set<string>(staff.map((s: any) => categorize(s.role)));
    return ["All", ...Array.from(set)];
  }, [staff]);

  const filtered = useMemo(() => {
    return staff.filter((s: any) => {
      const matchCat = filter === "All" || categorize(s.role) === filter;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.subjects?.some((x: string) => x.toLowerCase().includes(q));
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
              placeholder="Search by name, role or subject..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition"
            />
          </div>
        </div>

        {/* Staff grid */}
        <motion.div
          key={`${filter}-${query}-${showAll}`}
          variants={stagger(0.02, 0.04)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
        >
          {visible.map((s: any) => (
            <motion.div
              key={s.id}
              variants={fadeUp}
              className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative w-full h-64">
                <img
                  src={s.photo}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: s._imgPosition ?? "center top",
                    transform: s._imgZoom && s._imgZoom !== 1 ? `scale(${s._imgZoom})` : undefined,
                    transformOrigin: s._imgPosition ?? "center top",
                  }}
                />

                {/* OVERLAY */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-700 via-green-600/70 to-transparent p-3">
                  <p className="text-[11px] uppercase tracking-wide text-yellow-300 font-semibold line-clamp-1">
                    {s.role}
                  </p>
                  <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                    {s.name}
                  </h3>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3 flex flex-col gap-2 flex-grow">
                {s.subjects && s.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {s.subjects.map((sub: string) => (
                      <span
                        key={sub}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-green-500 text-green-600 bg-green-50 font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}

                {s.bio && (
                  <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3">
                    {s.bio}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">
            No faculty matches your search.
          </p>
        )}

        {filtered.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow-card hover:shadow-elegant transition-all"
            >
              {showAll
                ? (<>Show less <ChevronUp className="w-4 h-4" /></>)
                : (<>View all {filtered.length} <ChevronDown className="w-4 h-4" /></>)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}                <img
                  src={s.photo}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: s._imgPosition ?? "center top",
                    transform: s._imgZoom && s._imgZoom !== 1 ? `scale(${s._imgZoom})` : undefined,
                    transformOrigin: s._imgPosition ?? "center top",
                  }}
                />

                {/* OVERLAY */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-green-700 via-green-600/70 to-transparent p-3">
                  <p className="text-[11px] uppercase tracking-wide text-yellow-300 font-semibold line-clamp-1">
                    {s.role}
                  </p>
                  <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                    {s.name}
                  </h3>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-3 flex flex-col gap-2 flex-grow">
                {s.subjects && s.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {s.subjects.map((sub: string) => (
                      <span
                        key={sub}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-green-500 text-green-600 bg-green-50 font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}

                {s.bio && (
                  <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3">
                    {s.bio}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">
            No faculty matches your search.
          </p>
        )}

        {filtered.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow-card hover:shadow-elegant transition-all"
            >
              {showAll
                ? (<>Show less <ChevronUp className="w-4 h-4" /></>)
                : (<>View all {filtered.length} <ChevronDown className="w-4 h-4" /></>)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
