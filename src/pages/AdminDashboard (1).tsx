import { useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  LogOut, Database, Image, Users, Bell, Calendar, Trophy, Award,
  Plus, Pencil, Trash2, X, Save, Pin, ChevronLeft, Upload, Loader2, Rocket
} from "lucide-react";
import SeedImport from "./SeedImport";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "notices" | "events" | "staff" | "gallery" | "toppers" | "keyDates" | "awards";

const sections = [
  { key: "notices" as Section, label: "Notices", icon: Bell, color: "bg-blue-500/10 text-blue-600" },
  { key: "events" as Section, label: "Events", icon: Calendar, color: "bg-purple-500/10 text-purple-600" },
  { key: "staff" as Section, label: "Staff", icon: Users, color: "bg-green-500/10 text-green-600" },
  { key: "gallery" as Section, label: "Gallery", icon: Image, color: "bg-pink-500/10 text-pink-600" },
  { key: "toppers" as Section, label: "Toppers", icon: Trophy, color: "bg-yellow-500/10 text-yellow-600" },
  { key: "keyDates" as Section, label: "Key Dates", icon: Calendar, color: "bg-orange-500/10 text-orange-600" },
  { key: "awards" as Section, label: "Awards", icon: Award, color: "bg-red-500/10 text-red-600" },
] as const;

// ─── Default empty forms per section ─────────────────────────────────────────
const emptyForm: Record<Section, any> = {
  notices: { title: "", body: "", date: "", pinned: false },
  events: { title: "", description: "", date: "", location: "", coverImage: "" },
  staff: { name: "", role: "", subjects: "", bio: "", photo: "" },
  gallery: { title: "", category: "", images: [], type: "image" },
  toppers: { name: "", class: "", year: "", percentage: "", rank: "", photo: "" },
  keyDates: { title: "", date: "", description: "", type: "Academic" },
  awards: { title: "", year: "", description: "" },
};

// ─── Field configs ─────────────────────────────────────────────────────────
const fields: Record<Section, { key: string; label: string; type?: string; options?: string[] }[]> = {
  notices: [
    { key: "title", label: "Title" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "date", label: "Date", type: "date" },
    { key: "pinned", label: "Pinned", type: "checkbox" },
  ],
  events: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "date", label: "Date", type: "date" },
    { key: "location", label: "Location" },
    { key: "coverImage", label: "Cover Image URL" },
  ],
  staff: [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "subjects", label: "Subjects (comma separated)" },
    { key: "bio", label: "Bio", type: "textarea" },
    { key: "photo", label: "Photo URL" },
  ],
  gallery: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "images", label: "Images", type: "multi-image" },
    { key: "type", label: "Type", type: "select", options: ["image", "video"] },
  ],
  toppers: [
    { key: "name", label: "Name" },
    { key: "class", label: "Class" },
    { key: "year", label: "Year" },
    { key: "percentage", label: "Percentage", type: "number" },
    { key: "rank", label: "Rank", type: "number" },
    { key: "photo", label: "Photo URL" },
  ],
  keyDates: [
    { key: "title", label: "Title" },
    { key: "date", label: "Date", type: "date" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "type", label: "Type", type: "select", options: ["Academic", "Exam", "Holiday", "Event"] },
  ],
  awards: [
    { key: "title", label: "Title" },
    { key: "year", label: "Year" },
    { key: "description", label: "Description", type: "textarea" },
  ],
};

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

  // Parse objectPosition (supports "X% Y%" and keyword forms)
  const parsePos = (pos: string): [number, number] => {
    const parts = pos.trim().split(/\s+/);
    const parseVal = (v: string, axis: "x" | "y") => {
      if (!v) return 50;
      if (v.endsWith("%")) return parseFloat(v);
      const map: Record<string, number> = {
        left: 0, center: 50, right: 100, top: 0, bottom: 100,
      };
      return map[v] ?? 50;
    };
    return [parseVal(parts[0], "x"), parseVal(parts[1] ?? "center", "y")];
  };

  const [px, py] = parsePos(objectPosition);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPX: px, startPY: py };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    // sensitivity: 0.5% per pixel — feels natural on mobile
    const sensitivity = 0.5;
    const dx = (e.clientX - dragRef.current.startX) * sensitivity;
    const dy = (e.clientY - dragRef.current.startY) * sensitivity;
    // Dragging left → image moves left → higher X% (reveals right side)
    const newPX = Math.max(0, Math.min(100, dragRef.current.startPX - dx));
    const newPY = Math.max(0, Math.min(100, dragRef.current.startPY - dy));
    onChange(`${newPX.toFixed(1)}% ${newPY.toFixed(1)}%`, objectFit, zoom);
  };

  const onPointerUp = () => { dragRef.current = null; };

  return (
    <div className="mt-2 p-3 rounded-xl border bg-muted/30 space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Photo Framing
      </p>

      {/* Draggable preview — grab & drag like Instagram */}
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
            width: "100%",
            height: "100%",
            objectFit: objectFit as any,
            objectPosition,
            transform: `scale(${zoom})`,
            transformOrigin: objectPosition,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        {/* drag hint overlay (fades out on interaction) */}
        <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
          <span className="text-[9px] text-white/80 bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-sm">
            drag to move
          </span>
        </div>
      </div>

      {/* Fit mode */}
      <div>
        <p className="text-[10px] text-muted-foreground mb-1">Fit Mode</p>
        <div className="flex gap-1.5">
          {["cover", "contain", "fill"].map((fit) => (
            <button
              key={fit}
              type="button"
              onClick={() => onChange(objectPosition, fit, zoom)}
              className={`text-[10px] px-2 py-1 rounded border transition-colors capitalize
                ${objectFit === fit ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom slider */}
      <div>
        <p className="text-[10px] text-muted-foreground mb-1">Zoom: {Math.round(zoom * 100)}%</p>
        <input
          type="range"
          min={0.8}
          max={2.5}
          step={0.05}
          value={zoom}
          onChange={(e) => onChange(objectPosition, objectFit, parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* Reset button */}
      <button
        type="button"
        onClick={() => onChange("50% 50%", "cover", 1)}
        className="text-[10px] text-muted-foreground hover:text-foreground underline w-full text-center"
      >
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

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isCloudinaryConfigured) { alert("Cloudinary not configured."); return; }
    setUploading(true);
    try {
      if (fieldKey === "images") {
        // Upload all selected images and append to existing images array
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
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      alert("Save failed");
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
                      {uploading ? "Uploading…" : `Upload images (select multiple)`}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, f.key)}
                        disabled={uploading}
                      />
                    </label>
                    {(form.images ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(form.images as string[]).map((url: string, idx: number) => (
                          <div key={idx} className="relative">
                            <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{(form.images ?? []).length} image(s) added</p>
                  </div>
                ) : f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={form[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : f.type === "checkbox" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm">Yes</span>
                  </label>
                ) : f.type === "select" ? (
                  <select
                    value={form[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type={f.type ?? "text"}
                      value={form[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {isImageField && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-primary hover:underline">
                        <Upload className="w-3 h-3" />
                        {uploading ? "Uploading…" : "Or upload image"}
                        <input
                          type="file"
                          accept="image/*"
                          multiple={section === "gallery"}
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, f.key)}
                          disabled={uploading}
                        />
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

  // Bulk upload multiple images to gallery
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
    if (!colRef) throw new Error("Firebase not connected");
    if (data.id) {
      const { id, ...rest } = data;
      if (sectionKey === "staff" && typeof rest.subjects === "string") {
        rest.subjects = rest.subjects.split(",").map((s: string) => s.trim());
      }
      await updateDoc(doc(db!, sectionKey, id), { ...rest, updatedAt: serverTimestamp() });
    } else {
      let saveData = { ...data, createdAt: serverTimestamp() };
      if (sectionKey === "staff" && typeof saveData.subjects === "string") {
        saveData.subjects = saveData.subjects.split(",").map((s: string) => s.trim());
      }
      await addDoc(colRef, saveData);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    try {
      // Cloudinary se bhi delete karo (agar public_id available hai)
      const item = items.find((i) => i.id === id);
      if (item && isCloudinaryConfigured) {
        // Single image (staff photo, event cover, etc.)
        if (item.public_id) {
          await deleteFromCloudinary(item.public_id).catch(() => {});
        }
        // Gallery item ke saare images
        if (Array.isArray(item.public_ids)) {
          for (const pid of item.public_ids) {
            await deleteFromCloudinary(pid).catch(() => {});
          }
        }
      }
      // Firestore se delete karo
      await deleteDoc(doc(db, sectionKey, id));
    } finally {
      setDeleting(null);
    }
  };

  const sec = sections.find((s) => s.key === sectionKey)!;

  const getTitle = (item: any) =>
    item.title ?? item.name ?? item.id ?? "—";

  const getSubtitle = (item: any) => {
    if (sectionKey === "notices") return item.date + (item.pinned ? " • 📌 Pinned" : "");
    if (sectionKey === "events") return `${item.date} • ${item.location ?? ""}`;
    if (sectionKey === "staff") return item.role ?? "";
    if (sectionKey === "gallery") return `${item.category ?? ""} • ${Array.isArray(item.images) ? item.images.length : 1} photo(s)`;
    if (sectionKey === "toppers") return `${item.class} • ${item.percentage}% • Rank ${item.rank}`;
    if (sectionKey === "keyDates") return `${item.date} • ${item.type}`;
    if (sectionKey === "awards") return `${item.year} • ${item.description}`;
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
        <Button
          onClick={() => setModal({ open: true, item: null })}
          className="bg-primary text-primary-foreground"
          size="sm"
          disabled={!db}
        >
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
          Firebase not connected. Add env vars and redeploy to enable CRUD.
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No items yet. Tap Add to create one.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/30 transition-colors">
            {getThumb(item) && (
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border">
                <img
                  src={getThumb(item)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
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

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, isAdmin, logout, loading, configured } = useAuth();
  const content = useContent() as any;
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [showSeed, setShowSeed] = useState(false);

  // Wait for Firebase to restore session before redirecting
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
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeSection && (
              <button onClick={() => setActiveSection(null)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <p className="text-xs text-muted-foreground">DPS Kanpur</p>
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

        {/* Section detail view */}
        {activeSection ? (
          <SectionManager
            sectionKey={activeSection}
            items={content[activeSection] ?? []}
            onBack={() => setActiveSection(null)}
          />
        ) : (
          /* Dashboard grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sections.map((s) => {
              const items = content[s.key] ?? [];
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className="rounded-2xl bg-card border p-5 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition-all active:scale-95"
                >
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
