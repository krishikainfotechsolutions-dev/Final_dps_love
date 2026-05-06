import { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LogOut, Database, Image, Users, Bell, Calendar, Trophy, Award,
  Plus, Pencil, Trash2, X, Save, Pin, ChevronLeft, Upload, Loader2, Rocket,
  BookOpen, FileText
} from "lucide-react";
import SeedImport from "./SeedImport";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "notices" | "events" | "staff" | "gallery" | "toppers" | "keyDates" | "awards" | "exams";

const sections = [
  { key: "notices" as Section, label: "Notices", icon: Bell, color: "bg-blue-500/10 text-blue-600" },
  { key: "events" as Section, label: "Events", icon: Calendar, color: "bg-purple-500/10 text-purple-600" },
  { key: "staff" as Section, label: "Staff", icon: Users, color: "bg-green-500/10 text-green-600" },
  { key: "gallery" as Section, label: "Gallery", icon: Image, color: "bg-pink-500/10 text-pink-600" },
  { key: "toppers" as Section, label: "Toppers", icon: Trophy, color: "bg-yellow-500/10 text-yellow-600" },
  { key: "keyDates" as Section, label: "Key Dates", icon: Calendar, color: "bg-orange-500/10 text-orange-600" },
  { key: "awards" as Section, label: "Awards", icon: Award, color: "bg-red-500/10 text-red-600" },
  { key: "exams" as Section, label: "Exams", icon: BookOpen, color: "bg-indigo-500/10 text-indigo-600" },
] as const;

// ─── Default empty forms per section ─────────────────────────────────────────
const emptyForm: Record<Section, any> = {
  notices:  { title: "", body: "", date: "", pinned: false, link: "" },
  events:   { title: "", description: "", date: "", location: "", coverImage: "" },
  staff:    { name: "", role: "", subjects: "", bio: "", photo: "", filter: "" },
  gallery:  { title: "", category: "", images: [], type: "image" },
  toppers:  { name: "", class: "", year: "", percentage: "", rank: "", photo: "" },
  keyDates: { title: "", date: "", description: "", type: "Academic", link: "" },
  awards:   { title: "", year: "", description: "" },
};

// ─── Field configs ────────────────────────────────────────────────────────────
const fields: Record<Section, { key: string; label: string; type?: string; options?: string[] }[]> = {
  notices: [
    { key: "title",  label: "Title" },
    { key: "body",   label: "Body", type: "textarea" },
    { key: "date",   label: "Date", type: "date" },
    { key: "pinned", label: "Pinned", type: "checkbox" },
    { key: "link",   label: "Link (optional — attach PDF / URL)" },
  ],
  events: [
    { key: "title",       label: "Title" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "date",        label: "Date", type: "date" },
    { key: "location",    label: "Location" },
    { key: "coverImage",  label: "Cover Image URL" },
  ],
  staff: [
    { key: "name",     label: "Name" },
    { key: "role",     label: "Role" },
    { key: "subjects", label: "Subjects (comma separated)" },
    { key: "bio",      label: "Bio", type: "textarea" },
    { key: "photo",    label: "Photo URL" },
    { key: "filter",   label: "Filter Category (e.g. Leadership, Support…)" },
  ],
  gallery: [
    { key: "title",    label: "Title" },
    { key: "category", label: "Category" },
    { key: "images",   label: "Images", type: "multi-image" },
    { key: "type",     label: "Type", type: "select", options: ["image", "video"] },
  ],
  toppers: [
    { key: "name",       label: "Name" },
    { key: "class",      label: "Class" },
    { key: "year",       label: "Year" },
    { key: "percentage", label: "Percentage", type: "number" },
    { key: "rank",       label: "Rank", type: "number" },
    { key: "photo",      label: "Photo URL" },
  ],
  keyDates: [
    { key: "title",       label: "Title" },
    { key: "date",        label: "Date", type: "date" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "type",        label: "Type", type: "select", options: ["Academic", "Exam", "Holiday", "Event"] },
    { key: "link",        label: "Link (optional — attach circular / PDF / URL)" },
  ],
  awards: [
    { key: "title",       label: "Title" },
    { key: "year",        label: "Year" },
    { key: "description", label: "Description", type: "textarea" },
  ],
};

// ─── Strip Firestore-internal / non-serialisable fields before writing ────────
function cleanForFirestore(data: Record<string, any>): Record<string, any> {
  const SKIP = new Set(["id", "createdAt", "updatedAt"]);
  return Object.fromEntries(
    Object.entries(data).filter(([k, v]) => {
      if (SKIP.has(k)) return false;
      if (v === undefined) return false;
      // Drop Firestore Timestamp objects that sneak back in via ContentContext
      if (v !== null && typeof v === "object" && typeof (v as any).toDate === "function") return false;
      return true;
    })
  );
}

// ─── Image Position/Zoom Editor (Instagram-style drag) ────────────────────────
function ImagePositionEditor({
  url,
  objectPosition,
  objectFit,
  zoom,
  onChange,
  shape = "rect",
}: {
  url: string;
  objectPosition: string;
  objectFit: string;
  zoom: number;
  onChange: (pos: string, fit: string, zoom: number) => void;
  shape?: "rect" | "circle";
}) {
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPX: number;
    startPY: number;
  } | null>(null);

  const parsePos = (pos: string): [number, number] => {
    const parts = pos.trim().split(/\s+/);
    const parseVal = (v: string) => {
      if (!v) return 50;
      if (v.endsWith("%")) return parseFloat(v);
      const map: Record<string, number> = { left: 0, center: 50, right: 100, top: 0, bottom: 100 };
      return map[v] ?? 50;
    };
    return [parseVal(parts[0]), parseVal(parts[1] ?? "center")];
  };

  const [px, py] = parsePos(objectPosition);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPX: px, startPY: py };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const sensitivity = 0.5;
    const dx = (e.clientX - dragRef.current.startX) * sensitivity;
    const dy = (e.clientY - dragRef.current.startY) * sensitivity;
    const newPX = Math.max(0, Math.min(100, dragRef.current.startPX - dx));
    const newPY = Math.max(0, Math.min(100, dragRef.current.startPY - dy));
    onChange(`${newPX.toFixed(1)}% ${newPY.toFixed(1)}%`, objectFit, zoom);
  };

  const onPointerUp = () => { dragRef.current = null; };

  return (
    <div className="mt-2 p-3 rounded-xl border bg-muted/30 space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Photo Framing</p>
      <div
        className={`mx-auto relative ${shape === "circle" ? "w-32 h-32 rounded-full" : "w-32 h-40 rounded-lg"} overflow-hidden border-2 border-primary/40 bg-muted cursor-grab active:cursor-grabbing select-none touch-none`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={url}
          alt="preview"
          draggable={false}
          style={{
            width: "100%", height: "100%",
            objectFit: objectFit as any, objectPosition,
            transform: `scale(${zoom})`, transformOrigin: objectPosition,
            pointerEvents: "none", userSelect: "none",
          }}
        />
        <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
          <span className="text-[9px] text-white/80 bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-sm">drag to move</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground mb-1">Fit Mode</p>
        <div className="flex gap-1.5">
          {["cover", "contain", "fill"].map((fit) => (
            <button key={fit} type="button" onClick={() => onChange(objectPosition, fit, zoom)}
              className={`text-[10px] px-2 py-1 rounded border transition-colors capitalize ${objectFit === fit ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}>
              {fit}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground mb-1">Zoom: {Math.round(zoom * 100)}%</p>
        <input type="range" min={0.8} max={2.5} step={0.05} value={zoom}
          onChange={(e) => onChange(objectPosition, objectFit, parseFloat(e.target.value))}
          className="w-full accent-primary" />
      </div>
      <button type="button" onClick={() => onChange("50% 50%", "cover", 1)}
        className="text-[10px] text-muted-foreground hover:text-foreground underline w-full text-center">
        Reset to center
      </button>
    </div>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────
function ItemModal({
  section, item, onClose, onSave,
}: {
  section: Section;
  item: any | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState<any>(() => {
    const base = item ?? emptyForm[section];
    return {
      ...base,
      _imgPosition: base._imgPosition ?? "center center",
      _imgFit: base._imgFit ?? "cover",
      _imgZoom: base._imgZoom ?? 1,
    };
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isCloudinaryConfigured) { alert("Cloudinary not configured."); return; }
    setUploading(true);
    try {
      if (fieldKey === "images") {
        const existing: string[] = form.images ?? [];
        const existingPids: string[] = form.public_ids ?? [];
        const newUrls: string[] = [];
        const newPids: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const result = await uploadToCloudinary(files[i], "school/gallery");
          newUrls.push(result.secure_url);
          newPids.push(result.public_id);
        }
        set("images", [...existing, ...newUrls]);
        set("public_ids", [...existingPids, ...newPids]);
      } else {
        const result = await uploadToCloudinary(files[0], "school");
        set(fieldKey, result.secure_url);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err?.message ?? "Unknown error"}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const imgs: string[] = [...(form.images ?? [])];
    const pids: string[] = [...(form.public_ids ?? [])];
    imgs.splice(index, 1);
    pids.splice(index, 1);
    set("images", imgs);
    set("public_ids", pids);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(form);
      onClose();
    } catch (e: any) {
      const msg = e?.message ?? String(e) ?? "Unknown error";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{item ? "Edit" : "Add"} {section}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {fields[section].map((f) => {
            const isImageField = f.key === "photo" || f.key === "coverImage" || f.key === "url";
            return (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
                {f.type === "multi-image" ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-primary hover:underline">
                      <Upload className="w-3 h-3" />
                      {uploading ? "Uploading…" : "Upload images (select multiple)"}
                      <input type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => handleImageUpload(e, f.key)} disabled={uploading} />
                    </label>
                    {(form.images ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(form.images as string[]).map((url: string, idx: number) => (
                          <div key={idx} className="relative">
                            <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                            <button type="button" onClick={() => removeImage(idx)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{(form.images ?? []).length} image(s) added</p>
                  </div>
                ) : f.type === "textarea" ? (
                  <textarea rows={3} value={form[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                ) : f.type === "checkbox" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Yes</span>
                  </label>
                ) : f.type === "select" ? (
                  <select value={form[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input type={f.type ?? "text"} value={form[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.key === "link" ? "https://..." : undefined}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    {isImageField && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-primary hover:underline">
                        <Upload className="w-3 h-3" />
                        {uploading ? "Uploading…" : "Or upload image"}
                        <input type="file" accept="image/*" multiple={section === "gallery"} className="hidden"
                          onChange={(e) => handleImageUpload(e, f.key)} disabled={uploading} />
                      </label>
                    )}
                    {isImageField && form[f.key] && (
                      <>
                        <img src={form[f.key]} alt="" className="w-20 h-20 object-cover rounded-lg border mt-1" />
                        {(section === "staff" || section === "toppers") && (
                          <ImagePositionEditor
                            url={form[f.key]}
                            objectPosition={form._imgPosition ?? "center center"}
                            objectFit={form._imgFit ?? "cover"}
                            zoom={form._imgZoom ?? 1}
                            shape={section === "toppers" ? "circle" : "rect"}
                            onChange={(pos, fit, zoom) => {
                              set("_imgPosition", pos);
                              set("_imgFit", fit);
                              set("_imgZoom", zoom);
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {saveError && (
          <div className="mx-6 mb-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            <span className="font-semibold">Save failed:</span> {saveError}
          </div>
        )}

        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || uploading} className="bg-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Manager ──────────────────────────────────────────────────────────
function SectionManager({ sectionKey, items, onBack }: { sectionKey: Section; items: any[]; onBack: () => void }) {
  const [modal, setModal] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);

  const colRef = db ? collection(db, sectionKey) : null;

  const handleBulkGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isCloudinaryConfigured) { alert("Cloudinary not configured"); return; }
    setBulkUploading(true);
    let successCount = 0;
    let failCount = 0;
    try {
      for (const file of Array.from(files)) {
        try {
          const result = await uploadToCloudinary(file, "school/gallery");
          if (colRef) {
            await addDoc(colRef, {
              title: file.name.replace(/\.[^/.]+$/, ""),
              category: "General",
              url: result.secure_url,
              public_id: result.public_id,
              type: "image",
              createdAt: serverTimestamp(),
            });
            successCount++;
          }
        } catch {
          failCount++;
        }
      }
      alert(`Bulk upload done!\n✅ ${successCount} uploaded\n${failCount > 0 ? `❌ ${failCount} failed` : ""}`);
    } finally {
      setBulkUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async (data: any) => {
    if (!colRef || !db) throw new Error("Firebase not configured. Please add VITE_FIREBASE_* environment variables and redeploy.");

    const clean = cleanForFirestore(data);

    // Convert comma-separated subjects back to array for staff
    if (sectionKey === "staff" && typeof clean.subjects === "string") {
      
