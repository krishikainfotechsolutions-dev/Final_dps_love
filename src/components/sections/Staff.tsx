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
    <section
      id="staff"
      className="py-24 relative scroll-mt-24"
      style={{
        background:
          "linear-gradient(135deg, hsl(145 83% 97%) 0%, hsl(0 0% 100%) 50%, hsl(44 94% 97%) 100%)",
        borderTop: "1px solid hsl(145 30% 88%)",
        borderBottom: "1px solid hsl(44 60% 88%)",
      }}
    >
      {/* Geometric accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, hsl(145 83% 26%) 0, hsl(145 83% 26%) 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          eyebrow="Our People"
          title={`Meet our ${staff.length}+ faculty members`}
          subtitle="Mentors, coaches and lifelong learners."
        />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setFilter(c);
                setShowAll(false);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm border font-medium transition-all",
                filter === c
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-white border-primary/20 text-muted-foreground hover:border-primary/50 hover:text-primary"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(true);
            }}
            placeholder="Search by name, subject or role..."
            className="w-full pl-10 pr-4 py-2.5 border border-primary/20 rounded-full bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        {/* Grid — uniform card heights via CSS grid rows */}
        <motion.div
          variants={stagger(0.02, 0.04)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
          // Each row height is fixed so all cards in the same row align perfectly
        >
          {visible.map((s: any) => (
           <motion.div
  key={s.id}
  variants={fadeUp}
  className="hover-lift"
  style={{
    borderRadius: "1rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)", // optional softer shadow
    background: "#ffffff", // clean white
  }}
>
              {/* Inner card */}
              <div
                className="rounded-[14px] overflow-hidden flex flex-col h-full"
                style={{
                  background:
                    "linear-gradient(160deg, #ffffff 0%, hsl(145 83% 96%) 60%, hsl(145 60% 92%) 100%)",
                }}
              >
                {/* Fixed-ratio image wrapper */}
                <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                  <img
                    src={s.photo}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(s.name) +
                        "&background=0B7A3B&color=fff&size=200";
                    }}
                  />
                  {/* Gradient overlay at bottom of image */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-8"
                    style={{
                      background:
                        "linear-gradient(to top, hsl(145 83% 96%), transparent)",
                    }}
                  />
                </div>

                {/* Info panel */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-wide leading-tight">
                    {s.role}
                  </p>
                  <h3 className="font-bold text-sm text-foreground leading-snug mt-0.5">
                    {s.name}
                  </h3>

                  {s.bio && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2 flex-1">
                      {s.bio}
                    </p>
                  )}

                  {s.subjects && s.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.subjects.map((sub: string) => (
                        <span
                          key={sub}
                          className="text-[10px] border border-primary/20 bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Show more/less button */}
        {filtered.length > INITIAL_VISIBLE && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:opacity-90 transition-opacity shadow-card"
            >
              {showAll ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>View All {filtered.length} Staff <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
          }
