import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { SCHOOL } from "@/lib/seed";
import { fadeUp, viewportOnce } from "@/lib/motion";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Invalid phone").max(20),
  message: z.string().trim().min(5, "Message too short").max(1000),
});
type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    try {
      const text = `Hi! I'm ${data.name} (${data.email}, ${data.phone})\n\n${data.message}`;
      window.open(`https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      toast({ title: "Message ready", description: "We've opened WhatsApp so you can send your message." });
      reset();
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };
  return (
    <section id="contact" className="relative py-24 scroll-mt-24">
      <div className="container mx-auto px-4">
        <SectionHeader eyebrow="Get in Touch" title="We'd love to hear from you" subtitle="Questions, admissions, partnerships — we'll respond promptly." />
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="rounded-3xl p-8 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-elegant">
            <h3 className="text-2xl font-bold">Visit our campus</h3>
            <p className="opacity-90 mt-2">Open Mon–Sat, 8:00 AM – 4:00 PM</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="w-5 h-5 mt-0.5 text-gold shrink-0" /><span>{SCHOOL.address}</span></li>
              <li className="flex gap-3"><Phone className="w-5 h-5 mt-0.5 text-gold shrink-0" /><a href={`tel:${SCHOOL.phone}`} className="hover:text-gold">{SCHOOL.phone}</a></li>
              <li className="flex gap-3"><Mail className="w-5 h-5 mt-0.5 text-gold shrink-0" /><a href={`mailto:${SCHOOL.email}`} className="hover:text-gold">{SCHOOL.email}</a></li>
            </ul>
            <div className="mt-6 rounded-2xl overflow-hidden border border-white/20 aspect-video">
              <iframe title="School location" className="w-full h-full" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent("Kanpur, Uttar Pradesh, India")}&output=embed`} />
            </div>
          </motion.div>
          <motion.form variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} onSubmit={handleSubmit(onSubmit)} className="rounded-3xl p-8 bg-card border shadow-card space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} placeholder="Your name" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="98xxxxxxxx" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} {...register("message")} placeholder="How can we help?" />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-glow text-primary-foreground">
              <Send className="w-4 h-4" /> Send Message
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">We'll open WhatsApp with your message ready to send.</p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
