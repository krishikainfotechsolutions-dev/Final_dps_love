import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, FileText, Download, CalendarDays } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EXAM_TYPE_STYLES: Record<string, { badge: string; border: string; dot: string }> = {
  "Unit Test":  { badge: "bg-blue-100 text-blue-700 border-blue-200",   border: "border-blue-200",   dot: "bg-blue-400" },
  "Half Yearly":{ badge: "bg-orange-100 text-orange-700 border-orange-200", border: "border-orange-200", dot: "bg-orange-400" },
  "Annual":     { badge: "bg-green-100 text-green-700 border-green-200",  border: "border-green-200",  dot: "bg-green-400" },
  "Pre-Board":  { badge: "bg-red-100 text-red-700 border-red-200",       border: "border-red-200",    dot: "bg-red-400" },
};

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function ExamCard({ exam, index }: { exam: any; index: number }) {
  const [open, setOpen] = useState(false);
  const style = EXAM_TYPE_STYLES[exam.examType] ?? {
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="rounded-2xl bg-white border border-primary/10 shadow-card overflow-hidden"
    >
      {/* Header row */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mb-2", style.badge)}>
              {exam.examType}
            </span>
            <h3 className="font-bold text-primary text-base leading-snug">{exam.examName}</h3>
            {(exam.startDate || exam.endDate) && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {exam.startDate && formatDate(exam.startDate)}
                  {exam.startDate && exam.endDate && " – "}
                  {exam.endDate && formatDate(exam.endDate)}
                </span>
              </div>
            )}
          </div>
          {/* Date Sheet button */}
          {exam.dateSheetUrl && (
            <a
              href={exam.dateSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary border-2 border-primary/30 hover:border-primary rounded-xl px-3 py-2 transition-colors hover:bg-primary/5"
            >
              <Download className="w-3.5 h-3.5" />
              Date Sheet
            </a>
          )}
        </div>

        {/* Syllabus toggle */}
        {Array.isArray(exam.syllabi) && exam.syllabi.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-glow transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-3 h-3" />
            </span>
            View Syllabus ({exam.syllabi.length} class{exam.syllabi.length !== 1 ? "es" : ""})
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")} />
          </button>
        )}
      </div>

      {/* Syllabi accordion */}
      <AnimatePresence initial={false}>
        {open && Array.isArray(exam.syllabi) && exam.syllabi.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-primary/10 px-5 py-4 bg-muted/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Class-wise Syllabus</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {exam.syllabi.map((row: { class: string; syllabusUrl: string }, i: number) => (
                  row.syllabusUrl ? (
                    <a
                      key={i}
                      href={row.syllabusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/20 bg-white hover:border-primary hover:shadow-sm transition-all group text-xs font-medium text-primary"
                    >
                      <FileText className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-primary-glow transition-colors" />
                      <span className="truncate">{row.class}</span>
                    </a>
                  ) : (
                    <div key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
                      <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{row.class}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Exams() {
  const content = useContent() as any;
  const exams: any[] = content.exams ?? [];

  const [filter, setFilter] = useState("All");

  const types = useMemo(() => {
    const set = new Set<string>(exams.map((e) => e.examType).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [exams]);

  const filtered = useMemo(() => {
    const list = filter === "All" ? [...exams] : exams.filter((e) => e.examType === filter);
    return list.sort((a, b) => {
      if (a.startDate && b.startDate) return +new Date(a.startDate) - +new Date(b.startDate);
      return 0;
    });
  }, [exams, filter]);

  if (exams.length === 0) return null;

  return (
    <section
      id="exams"
      className="relative py-24 scroll-mt-24"
      style={{
        background: "linear-gradient(160deg, hsl(240 83% 98%) 0%, hsl(44 94% 96%) 50%, hsl(240 60% 97%) 100%)",
        borderTop: "1px solid hsl(240 40% 88%)",
        borderBottom: "1px solid hsl(240 40% 88%)",
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(240 83% 26%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader eyebrow="Academic Schedule" title="Examinations & Syllabus" />

        {/* Filter tabs */}
        {types.length > 1 && (
          <div className="flex justify-center mb-10">
            <div className="flex gap-2 flex-wrap justify-center">
              {types.map((t) => {
                const style = EXAM_TYPE_STYLES[t];
                const isActive = filter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all shadow-sm",
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-card"
                        : "bg-white border-primary/20 text-primary hover:border-primary hover:shadow-card"
                    )}
                  >
                    {style && (
                      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", isActive ? "bg-white/70" : style.dot)} />
                    )}
                    {t === "All" ? "All Exams" : t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Exam cards */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
              <BookOpen className="w-10 h-10 opacity-30" />
              <p className="text-sm">No exams found for this filter.</p>
            </div>
          )}
          {filtered.map((exam, i) => (
            <ExamCard key={exam.id} exam={exam} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
