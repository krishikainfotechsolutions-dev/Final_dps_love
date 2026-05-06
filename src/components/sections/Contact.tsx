import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { SCHOOL } from "@/lib/seed";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [cls, setCls] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; cls?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Please enter your full name";
    if (!cls.trim()) e.cls = "Please enter the class";
    if (!phone.trim() || phone.trim().length < 7) e.phone = "Please enter a valid phone number";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitting(true);
    const text = `Hello! I would like to enquire about admission.\n\nName: ${name.trim()}\nClass: ${cls.trim()}\nPhone: ${phone.trim()}`;
    const waUrl = `https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(text)}`;
    window.location.href = waUrl;
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <section id="contact" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Get in Touch" title="We'd love to hear from you" subtitle="Questions, admissions, partnerships — we'll respond promptly." />
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
            <h3 className="text-2xl font-bold">Visit our campus</h3>
            <p className="opacity-90 mt-2">Open Mon–Sat, 7:00 AM – 2:00 PM</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="w-5 h-5 mt-0.5 text-gold shrink-0" /><span>{SCHOOL.address}</span></li>
              <li className="flex gap-3"><Phone className="w-5 h-5 mt-0.5 text-gold shrink-0" /><a href={`tel:${SCHOOL.phone}`} className="hover:text-gold">{SCHOOL.phone}</a></li>
              <li className="flex gap-3"><Mail className="w-5 h-5 mt-0.5 text-gold shrink-0" /><a href={`mailto:${SCHOOL.email}`} className="hover:text-gold">{SCHOOL.email}</a></li>
            </ul>
            <div className="mt-6 rounded-2xl overflow-hidden border border-white/20 aspect-video">
              <iframe title="School location" className="w-full h-full" loading="lazy" src="https://www.google.com/maps?q=26.4073243,80.3502374&output=embed" />
            </div>
          </motion.div>

          <motion.div id="admission-enquiry" variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 bg-card border shadow-card">
            <h3 className="text-xl font-bold text-primary mb-1">Admission Enquiry</h3>
            <p className="text-sm text-muted-foreground mb-6">Fill in your details and we'll connect with you on WhatsApp.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="adm-name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <input
                  id="adm-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student's full name"
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="adm-class" className="block text-sm font-medium text-foreground mb-1">Class</label>
                <input
                  id="adm-class"
                  type="text"
                  value={cls}
                  onChange={(e) => setCls(e.target.value)}
                  placeholder="e.g. Class 5, Jr. KG"
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                {errors.cls && <p className="text-xs text-destructive mt-1">{errors.cls}</p>}
              </div>
              <div>
                <label htmlFor="adm-phone" className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                <input
                  id="adm-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98xxxxxxxx"
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? "Opening WhatsApp…" : "Submit on WhatsApp"}
              </button>
              <p className="text-[11px] text-center text-muted-foreground">Tapping submit will open WhatsApp with your enquiry ready to send.</p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
