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
    <section className="py-24">
      <div className="container mx-auto px-4">
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
                "px-4 py-2 rounded-full text-sm border",
                filter === c
                  ? "bg-primary text-white"
                  : "bg-white border-gray-300"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-3 w-4 h-4" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(true);
            }}
            placeholder="Search staff..."
            className="w-full pl-10 pr-4 py-2 border rounded-full"
          />
        </div>

        {/* Grid */}
        <motion.div
          variants={stagger(0.02, 0.04)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {visible.map((s: any) => (
            <motion.div
              key={s.id}
              variants={fadeUp}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-60 overflow-hidden">
                <img
                  src={s.photo}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3 text-left">
                <p className="text-xs text-green-600 font-medium">{s.role}</p>
                <h3 className="font-bold text-sm leading-snug mt-0.5">{s.name}</h3>

                {s.bio && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {s.bio}
                  </p>
                )}

                {s.subjects && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.subjects.map((sub: string) => (
                      <span key={sub} className="text-xs border border-gray-300 px-2 py-0.5 rounded text-gray-600">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Button */}
        {filtered.length > INITIAL_VISIBLE && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-primary text-white rounded-full"
            >
              {showAll ? "Show Less" : `View All ${filtered.length}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
