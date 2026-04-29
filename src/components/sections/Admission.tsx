import { motion } from "framer-motion";
import { FileText, CalendarDays, CreditCard, ClipboardList, Info } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const ageTable = [
  { class: "Toddlers", age: "2.5 years" },
  { class: "Play Group", age: "3.5 years" },
  { class: "Jr. KG", age: "4.5 years" },
  { class: "Sr. KG", age: "5.5 years" },
];

const feeSchedule = [
  { month: "April", note: "2 months fee collected" },
  { month: "July", note: "2 months fee collected" },
  { month: "Nov – Dec", note: "2 months fee collected" },
  { month: "Other Months", note: "1 month fee collected" },
];

const documents = [
  "Birth Certificate",
  "Previous Class Report Card / Marksheet",
  "Transfer Certificate (if applicable)",
  "Passport Size Photographs (Student & Parents)",
  "Aadhaar Card Copy (Student & Parents)",
];

const steps = [
  "Fill admission form (online / offline)",
  "Submit all required documents",
  "Interaction or Entrance Test (if applicable)",
  "Admission confirmed after successful verification",
];

export default function Admission() {
  return (
    <section id="admissions" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-muted/40 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader
          eyebrow="Admissions"
          title="Join Our School Family"
          subtitle="Simple, transparent, and parent-friendly admission process for Session 2026–27."
        />

        <motion.div
          variants={stagger(0.05, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid md:grid-cols-2 gap-5 mt-2"
        >
          {/* Age Criteria */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 bg-card border hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Age Criteria</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Age calculated as on <span className="text-primary font-medium">1st April</span> of the academic session.
            </p>
            <div className="space-y-2">
              {ageTable.map((row) => (
                <div key={row.class} className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
                  <span className="text-sm text-foreground">{row.class}</span>
                  <span className="text-sm font-medium text-primary">{row.age}+</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              For Class 1 & above, age is verified from the Transfer Certificate (TC). TC must include the student's <span className="text-primary font-medium">Permanent Education Number (PEN)</span>.
            </p>
          </motion.div>

          {/* Fee Module */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 bg-card border border-gold/30 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold/15 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-foreground" />
              </div>
              <p className="font-semibold text-foreground">Fee Structure</p>
            </div>
            <div className="space-y-2 mb-4">
              {feeSchedule.map((f) => (
                <div key={f.month} className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
                  <span className="text-sm font-medium text-foreground">{f.month}</span>
                  <span className="text-xs text-muted-foreground">{f.note}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                A one-time <span className="text-primary font-medium">Registration & Admission Fee</span> is applicable at the time of enrollment. This is non-refundable. For detailed fee amounts, contact the school office directly.
              </p>
            </div>
          </motion.div>

          {/* Documents Required */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 bg-card border hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Documents Required</p>
            </div>
            <ul className="space-y-2.5">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Admission Process */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 bg-card border hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Admission Process</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Online & offline both modes available.</p>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 p-3">
              <CalendarDays className="w-4 h-4 text-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                Last date for Session 2026–27 will be announced. Complete formalities early to secure your child's seat.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
