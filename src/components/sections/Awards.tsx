import { motion } from "framer-motion";
import { Award as AwardIcon } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Awards() {
  const { awards } = useContent();
  return (
    <section id="awards" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Recognition" title="Awards & Honours" subtitle="Each accolade is a tribute to our students, teachers and parents." />
        <motion.div variants={stagger(0.05, 0.08)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((a: any) => (
            <motion.div key={a.id} variants={fadeUp} whileHover={{ y: -6 }} className="relative rounded-3xl p-6 bg-card border overflow-hidden group">
              <div className="absolute inset-x-0 -top-px h-px shimmer" />
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-[hsl(44_94%_38%)] text-gold-foreground flex items-center justify-center shadow-card group-hover:scale-110 transition-transform">
                  <AwardIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{a.year}</p>
                  <h3 className="font-semibold text-primary leading-tight">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
