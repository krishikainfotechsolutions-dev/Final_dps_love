import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import PrincipalDesk from "@/components/sections/PrincipalDesk";
import Notices from "@/components/sections/Notices";
import Events from "@/components/sections/Events";
import Staff from "@/components/sections/Staff";
import Gallery from "@/components/sections/Gallery";
import Toppers from "@/components/sections/Toppers";
import KeyDates from "@/components/sections/KeyDates";
import Awards from "@/components/sections/Awards";
import Contact from "@/components/sections/Contact";
import { SCHOOL } from "@/lib/seed";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    document.title = `${SCHOOL.name} | ${SCHOOL.tagline}`;
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", `${SCHOOL.shortName} in ${SCHOOL.city} — admissions open. ${SCHOOL.tagline}. Notices, events, faculty and gallery.`);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <PrincipalDesk />
        <Notices />
        <Events />
        <Staff />
        <Gallery />
        <Toppers />
        <KeyDates />
        <Awards />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
