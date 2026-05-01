import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SCHOOL } from "@/lib/seed";
import { useAuth } from "@/context/AuthContext";

const links = [
  { id: "about", label: "About" },
  { id: "principal", label: "Principal" },
  { id: "admissions", label: "Admissions" },
  { id: "courses", label: "Academics" },
  { id: "house", label: "Houses" },
  { id: "notices", label: "Notices" },
  { id: "events", label: "Events" },
  { id: "staff", label: "Staff" },
  { id: "gallery", label: "Gallery" },
  { id: "toppers", label: "Toppers" },
  { id: "key-dates", label: "Calendar" },
  { id: "awards", label: "Awards" },
  { id: "facilities", label: "Facilities" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const { isAdmin } = useAuth();
  const adminHref = isAdmin ? "/admin/dashboard" : "/admin/login";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className={cn(
        "container mx-auto px-4",
      )}>
        <div className={cn(
          "flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all",
          scrolled ? "glass shadow-card" : "bg-transparent",
        )}>
          <button onClick={() => go("hero")} className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-gold/60 transition-all">
              <img src={logo} alt="DPS Kanpur logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs md:text-sm font-semibold text-primary">{SCHOOL.shortName}</p>
              <p className="text-[10px] text-muted-foreground hidden md:block">Senior Secondary School</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
              >
                {l.label}
                <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-primary to-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to={adminHref}><Shield className="w-4 h-4" /> {isAdmin ? "Dashboard" : "Admin"}</Link>
            </Button>
            <Button onClick={() => go("contact")} size="sm" className="bg-gold text-gold-foreground hover:opacity-90 hidden md:inline-flex">
              Apply Now
            </Button>
            <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-lg hover:bg-primary/10" aria-label="Menu">
              {open ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-2 glass rounded-2xl p-4 shadow-elegant"
            >
              <div className="grid grid-cols-2 gap-2">
                {links.map((l) => (
                  <button key={l.id} onClick={() => go(l.id)} className="text-left px-3 py-2 rounded-lg hover:bg-primary/10 text-sm font-medium">
                    {l.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1 border-primary/30 text-primary"><Link to={adminHref}>{isAdmin ? "Dashboard" : "Admin"}</Link></Button>
                <Button onClick={() => go("contact")} size="sm" className="flex-1 bg-gold text-gold-foreground">Apply Now</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
