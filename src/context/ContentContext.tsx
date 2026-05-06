import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  seedNotices, seedEvents, seedStaff, seedGallery, seedToppers, seedKeyDates, seedAwards, seedExams,
} from "@/lib/seed";

type ContentCtx = {
  notices: any[];
  events: any[];
  staff: any[];
  gallery: any[];
  toppers: any[];
  keyDates: any[];
  awards: any[];
  exams: any[];
  liveMode: boolean;
};

const Ctx = createContext<ContentCtx | undefined>(undefined); 

const collections = ["notices", "events", "staff", "gallery", "toppers", "keyDates", "awards", "exams"] as const;

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<string, any[]>>({
    notices: seedNotices, events: seedEvents, staff: seedStaff,
    gallery: seedGallery, toppers: seedToppers, keyDates: seedKeyDates, awards: seedAwards, exams: seedExams,
  });
  const [liveMode, setLiveMode] = useState(false);

  useEffect(() => {
    if (!db || !isFirebaseConfigured) return;
    const unsubs = collections.map((name) => {
      try {
        const q = query(collection(db, name));
        return onSnapshot(
          q,
          (snap) => {
            const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            if (docs.length > 0) {
              setData((prev) => ({ ...prev, [name]: docs }));
              setLiveMode(true);
            }
          },
          (err) => console.warn(`Firestore ${name} subscription error:`, err.message),
        );
      } catch (e) {
        console.warn(`Could not subscribe to ${name}`, e);
        return () => {};
      }
    });
    return () => unsubs.forEach((u) => u && u());
  }, []);

  return <Ctx.Provider value={{ ...(data as any), liveMode }}>{children}</Ctx.Provider>;
}

export function useContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
