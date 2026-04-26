import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SCHOOL } from "@/lib/seed";

export default function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${SCHOOL.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-5 right-5 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-elegant hover:scale-110 transition-transform">
        <MessageCircle className="w-7 h-7" />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap glass px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </motion.a>
  );
}