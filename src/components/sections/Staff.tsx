import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useContent } from "@/context/ContentContext";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

export default function Staff() {
  const { staff } = useContent();
  return (
    <section id="staff" className="relative py-24 scroll-mt-24 bg-gradient-to-b from-transparent via-accent/30 to-transparent">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Our People" title="Meet our exceptional faculty" subtitle="Mentors, coaches and lifelong learners — committed to every child's growth." />
        <motion.div variants={stagger(0.05, 0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((s: any) => (
            <motion.div key={s.id} variants={fadeUp} className="group [perspective:1000px] h-[360px]">
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-card [backface-visibility:hidden]">
                  <img src={s.photo} alt={s.name} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
                    <h3 className="text-xl font-bold">{s.name}</h3>
                    <p className="text-sm text-gold">{s.role}</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-6 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-elegant">
                  <p className="text-xs uppercase tracking-widest text-gold mb-2">{s.role}</p>
                  <h3 className="text-2xl font-bold mb-3">{s.name}</h3>
                  <p className="text-sm opacity-90">{s.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.subjects?.map((sub: string) => (
                      <span key={sub} className="text-[10px] px-2 py-1 rounded-full bg-white/15 border border-white/20">{sub}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}