import logo from "@/assets/logo.jpg";
import { SCHOOL } from "@/lib/seed";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const sections = [
    { id: "about", label: "About" },
    { id: "notices", label: "Notices" },
    { id: "events", label: "Events" },
    { id: "gallery", label: "Gallery" }, 
    { id: "contact", label: "Contact" },
  ];
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-primary to-[hsl(145_83%_18%)] text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-14 relative">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold/60">
                <img src={logo} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold">{SCHOOL.shortName}</p>
                <p className="text-xs opacity-80">{SCHOOL.tagline}</p>
              </div>
            </div>
            <p className="mt-4 text-sm opacity-80 max-w-sm">Nurturing curious minds, kind hearts and bold leaders.</p>
          </div>
          <div>
            <p className="font-semibold text-gold mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <button onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })} className="opacity-80 hover:opacity-100 hover:text-gold transition-colors">{s.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gold mb-3">Reach Us</p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" /><span className="opacity-80">{SCHOOL.address}</span></li>
              <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 text-gold shrink-0" /><a href={`tel:${SCHOOL.phone}`} className="opacity-80 hover:opacity-100">{SCHOOL.phone}</a></li>
              <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 text-gold shrink-0" /><a href={`mailto:${SCHOOL.email}`} className="opacity-80 hover:opacity-100">{SCHOOL.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-xs opacity-70 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</p>
          <p>Every Child is Unique in its Own Way</p>
          <p>Built by <a href="https://krishikainfotechsolutions.netlify.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:opacity-100 underline underline-offset-2">Krishika Infotech Solutions</a></p>
        </div>
      </div>
    </footer>
  );
}
