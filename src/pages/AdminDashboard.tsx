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
      clean.subjects = clean.subjects.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    if (data.id) {
      // UPDATE existing document
      await updateDoc(doc(db, sectionKey, data.id), { ...clean, updatedAt: serverTimestamp() });
    } else {
      // ADD new document
      await addDoc(colRef, { ...clean, createdAt: serverTimestamp() });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    try {
      const item = items.find((i) => i.id === id);
      if (item && isCloudinaryConfigured) {
        if (item.public_id) await deleteFromCloudinary(item.public_id).catch(() => {});
        if (Array.isArray(item.public_ids)) {
          for (const pid of item.public_ids) await deleteFromCloudinary(pid).catch(() => {});
        }
      }
      await deleteDoc(doc(db, sectionKey, id));
    } finally {
      setDeleting(null);
    }
  };

  const sec = sections.find((s) => s.key === sectionKey)!;

  const getTitle = (item: any) => item.title ?? item.name ?? item.id ?? "—";

  const getSubtitle = (item: any) => {
    if (sectionKey === "notices")  return item.date + (item.pinned ? " • 📌 Pinned" : "") + (item.link ? " • 🔗 Link" : "");
    if (sectionKey === "events")   return `${item.date} • ${item.location ?? ""}`;
    if (sectionKey === "staff")    return item.role ?? "";
    if (sectionKey === "gallery")  return `${item.category ?? ""} • ${Array.isArray(item.images) ? item.images.length : 1} photo(s)`;
    if (sectionKey === "toppers")  return `${item.class} • ${item.percentage}% • Rank ${item.rank}`;
    if (sectionKey === "keyDates") return `${item.date} • ${item.type}` + (item.link ? " • 🔗 Link" : "");
    if (sectionKey === "awards")   return `${item.year} • ${item.description}`;
    return "";
  };

  const getThumb = (item: any) =>
    item.photo ?? item.coverImage ?? (Array.isArray(item.images) ? item.images[0] : item.url) ?? null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sec.color}`}>
          <sec.icon className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold">{sec.label}</h2>
        <span className="ml-auto text-sm text-muted-foreground">{items.length} items</span>
        <Button onClick={() => setModal({ open: true, item: null })} className="bg-primary text-primary-foreground" size="sm" disabled={!db}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
        {sectionKey === "gallery" && (
          <label className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border cursor-pointer font-medium transition-colors ${!db || bulkUploading ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}>
            <Upload className="w-3 h-3" />
            {bulkUploading ? "Uploading…" : "Bulk Upload"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleBulkGalleryUpload} disabled={!db || bulkUploading} />
          </label>
        )}
      </div>

      {!db && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          Firebase not connected. Add VITE_FIREBASE_* env vars and redeploy to enable CRUD.
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No items yet. Tap Add to create one.</div>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/30 transition-colors">
            {getThumb(item) && (
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border">
                <img src={getThumb(item)} alt=""
                  style={{
                    width: "100%", height: "100%",
                    objectFit: (item._imgFit ?? "cover") as any,
                    objectPosition: item._imgPosition ?? "center center",
                    transform: item._imgZoom ? `scale(${item._imgZoom})` : undefined,
                    transformOrigin: item._imgPosition ?? "center center",
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{getTitle(item)}</p>
              <p className="text-xs text-muted-foreground truncate">{getSubtitle(item)}</p>
            </div>
            {sectionKey === "notices" && item.pinned && <Pin className="w-3 h-3 text-primary flex-shrink-0" />}
            <button
              onClick={() => setModal({ open: true, item: { ...item, subjects: Array.isArray(item.subjects) ? item.subjects.join(", ") : item.subjects } })}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              disabled={!db}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600"
              disabled={!db || deleting === item.id}
            >
              {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {modal.open && (
        <ItemModal
          section={sectionKey}
          item={modal.item}
          onClose={() => setModal({ open: false, item: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}


// ─── Exam Modal (custom — handles dynamic syllabi list) ───────────────────────
const EXAM_TYPES = ["Unit Test", "Half Yearly", "Annual", "Pre-Board"];
const CLASS_OPTIONS = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8",
  "Class 9", "Class 10", "Class 11", "Class 12",
];

type SyllabusRow = { class: string; syllabusUrl: string };

const emptyExam = {
  examName: "",
  examType: "Half Yearly",
  startDate: "",
  endDate: "",
  dateSheetUrl: "",
  syllabi: [] as SyllabusRow[],
};

function ExamModal({
  item,
  onClose,
  onSave,
}: {
  item: any | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState<any>(() =>
    item
      ? { ...item, syllabi: item.syllabi ?? [] }
      : { ...emptyExam }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const uploadPdf = async (file: File, targetKey: string, rowIndex?: number) => {
    if (!isCloudinaryConfigured) { alert("Cloudinary not configured."); return; }
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, "school/exams");
      if (rowIndex !== undefined) {
        const syllabi = [...form.syllabi];
        syllabi[rowIndex] = { ...syllabi[rowIndex], syllabusUrl: result.secure_url };
        set("syllabi", syllabi);
      } else {
        set(targetKey, result.secure_url);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err?.message ?? "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const addSyllabus = () =>
    set("syllabi", [...form.syllabi, { class: "Class 1", syllabusUrl: "" }]);

  const updateSyllabus = (i: number, field: string, value: string) => {
    const syllabi = [...form.syllabi];
    syllabi[i] = { ...syllabi[i], [field]: value };
    set("syllabi", syllabi);
  };

  const removeSyllabus = (i: number) => {
    const syllabi = [...form.syllabi];
    syllabi.splice(i, 1);
    set("syllabi", syllabi);
  };

  const handleSubmit = async () => {
    if (!form.examName.trim()) { alert("Exam name required"); return; }
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(form);
      onClose();
    } catch (e: any) {
      setSaveError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">{item ? "Edit" : "Add"} Exam</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          {/* Exam Name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Exam Name</label>
            <input type="text" value={form.examName} onChange={(e) => set("examName", e.target.value)}
              placeholder="e.g. Half Yearly Exam 2025"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {/* Exam Type */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Exam Type</label>
            <select value={form.examType} onChange={(e) => set("examType", e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Date Sheet Upload */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Date Sheet (PDF / Image)</label>
            <div className="flex items-center gap-2">
              <input type="text" value={form.dateSheetUrl} onChange={(e) => set("dateSheetUrl", e.target.value)}
                placeholder="https://... or upload below"
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <label className="flex-shrink-0 flex items-center gap-1 text-xs text-primary border border-primary/30 rounded-lg px-3 py-2 cursor-pointer hover:bg-primary/5">
                <Upload className="w-3 h-3" /> {uploading ? "…" : "Upload"}
                <input type="file" accept="image/*,application/pdf" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadPdf(e.target.files[0], "dateSheetUrl")}
                  disabled={uploading} />
              </label>
            </div>
            {form.dateSheetUrl && (
              <a href={form.dateSheetUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-primary underline mt-1 inline-block">Preview uploaded file ↗</a>
            )}
          </div>

          {/* Class-wise Syllabus */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Class-wise Syllabus</label>
              <button type="button" onClick={addSyllabus}
                className="flex items-center gap-1 text-xs text-primary border border-primary/30 rounded-lg px-2.5 py-1 hover:bg-primary/5">
                <Plus className="w-3 h-3" /> Add Class
              </button>
            </div>

            {form.syllabi.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3 border-2 border-dashed rounded-lg">
                No syllabi added yet. Click "Add Class" to begin.
              </p>
            )}

            <div className="space-y-2">
              {form.syllabi.map((row: SyllabusRow, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl border bg-muted/20">
                  <select value={row.class}
                    onChange={(e) => updateSyllabus(i, "class", e.target.value)}
                    className="w-32 rounded-lg border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0">
                    {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" value={row.syllabusUrl}
                    onChange={(e) => updateSyllabus(i, "syllabusUrl", e.target.value)}
                    placeholder="PDF URL or upload →"
                    className="flex-1 rounded-lg border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                  <label className="flex-shrink-0 flex items-center gap-1 text-[10px] text-primary border border-primary/30 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-primary/5">
                    <Upload className="w-3 h-3" />
                    <input type="file" accept="image/*,application/pdf" className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadPdf(e.target.files[0], "syllabusUrl", i)}
                      disabled={uploading} />
                  </label>
                  <button type="button" onClick={() => removeSyllabus(i)}
                    className="p-1 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

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

// ─── Exams Manager ────────────────────────────────────────────────────────────
function ExamsManager({ items, onBack }: { items: any[]; onBack: () => void }) {
  const [modal, setModal] = useState<{ open: boolean; item: any | null }>({ open: false, item: null });
  const [deleting, setDeleting] = useState<string | null>(null);
  const colRef = db ? collection(db, "exams") : null;

  const EXAM_TYPE_COLORS: Record<string, string> = {
    "Unit Test": "bg-blue-100 text-blue-700",
    "Half Yearly": "bg-orange-100 text-orange-700",
    "Annual": "bg-green-100 text-green-700",
    "Pre-Board": "bg-red-100 text-red-700",
  };

  const handleSave = async (data: any) => {
    if (!colRef || !db) throw new Error("Firebase not configured.");
    const clean = cleanForFirestore(data);
    if (data.id) {
      await updateDoc(doc(db, "exams", data.id), { ...clean, updatedAt: serverTimestamp() });
    } else {
      await addDoc(colRef, { ...clean, createdAt: serverTimestamp() });
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (!confirm("Delete this exam?")) return;
    setDeleting(id);
    try { await deleteDoc(doc(db, "exams", id)); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-600">
          <BookOpen className="w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold">Exams</h2>
        <span className="ml-auto text-sm text-muted-foreground">{items.length} exams</span>
        <Button onClick={() => setModal({ open: true, item: null })} className="bg-primary text-primary-foreground" size="sm" disabled={!db}>
          <Plus className="w-4 h-4 mr-1" /> Add Exam
        </Button>
      </div>

      {!db && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          Firebase not connected. Add VITE_FIREBASE_* env vars to enable CRUD.
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No exams yet. Tap Add Exam to create one.</div>
        )}
        {items.map((exam) => (
          <div key={exam.id} className="rounded-2xl border bg-card p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={"text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded " + (EXAM_TYPE_COLORS[exam.examType] ?? "bg-gray-100 text-gray-700")}>
                    {exam.examType}
                  </span>
                  <p className="font-semibold text-sm">{exam.examName}</p>
                </div>
                {(exam.startDate || exam.endDate) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {exam.startDate && new Date(exam.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {exam.startDate && exam.endDate && " – "}
                    {exam.endDate && new Date(exam.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {exam.dateSheetUrl && (
                    <a href={exam.dateSheetUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-primary border border-primary/30 rounded-full px-2.5 py-0.5 hover:bg-primary/5">
                      <FileText className="w-3 h-3" /> Date Sheet
                    </a>
                  )}
                  {Array.isArray(exam.syllabi) && exam.syllabi.length > 0 && (
                    <span className="text-[11px] text-muted-foreground">{exam.syllabi.length} class syllab{exam.syllabi.length === 1 ? "us" : "i"}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setModal({ open: true, item: exam })}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" disabled={!db}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(exam.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600" disabled={!db || deleting === exam.id}>
                  {deleting === exam.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <ExamModal item={modal.item} onClose={() => setModal({ open: false, item: null })} onSave={handleSave} />
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, isAdmin, logout, loading, configured } = useAuth();
  const content = useContent() as any;
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [showSeed, setShowSeed] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading dashboard…</p>
    </div>
  );
  if (configured && !loading && !user) return <Navigate to="/admin/login" replace />;
  if (configured && !loading && user && !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeSection && (
              <button onClick={() => setActiveSection(null)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <p className="text-xs text-muted-foreground">DPS Kanpur — UP Board</p>
              <h1 className="text-lg font-bold text-primary flex items-center gap-2">
                <Database className="w-4 h-4" /> Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/">View Site</Link></Button>
            {!activeSection && (
              <Button onClick={() => setShowSeed(true)} variant="outline" size="sm" disabled={!configured}>
                <Rocket className="w-4 h-4 mr-1" /> Import Data
              </Button>
            )}
            <Button onClick={logout} variant="destructive" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!configured && (
          <div className="mb-5 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
            <strong>Demo mode.</strong> Firebase isn't configured — add VITE_FIREBASE_* env vars and redeploy to enable full CRUD.
          </div>
        )}

        {activeSection === "exams" ? (
          <ExamsManager items={content["exams"] ?? []} onBack={() => setActiveSection(null)} />
        ) : activeSection ? (
          <SectionManager
            sectionKey={activeSection}
            items={content[activeSection] ?? []}
            onBack={() => setActiveSection(null)}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sections.map((s) => {
              const items = content[s.key] ?? [];
              return (
                <button key={s.key} onClick={() => setActiveSection(s.key)}
                  className="rounded-2xl bg-card border p-5 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition-all active:scale-95">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{items.length}</p>
                  <p className="text-sm font-medium mt-0.5">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">Tap to manage</p>
                </button>
              );
            })}
          </div>
        )}
      </main>
      {showSeed && <SeedImport onClose={() => setShowSeed(false)} />}
    </div>
  );
}
