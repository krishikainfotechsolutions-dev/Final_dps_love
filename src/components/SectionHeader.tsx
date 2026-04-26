import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

export default function SectionHeader({
  eyebrow, title, subtitle, center = true,
}: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`max-w-3xl ${center ? "mx-auto text-center" : ""} mb-12`}
    >
      {eyebrow && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/15 text-primary border border-gold/30 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        {title.split(" ").map((w, i, a) => (
          <span key={i} className={i === a.length - 1 ? "text-gradient-primary" : ""}>{w}{i < a.length - 1 ? " " : ""}</span>
        ))}
      </h2>
      {subtitle && <p className="mt-4 text-base md:text-lg text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}