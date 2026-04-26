import { Link, Navigate } from "react-router-dom";
import { LogOut, Database, Image, Users, Bell, Calendar, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";

const sections = [
  { key: "notices", label: "Notices", icon: Bell },
  { key: "events", label: "Events", icon: Calendar },
  { key: "staff", label: "Staff", icon: Users },
  { key: "gallery", label: "Gallery", icon: Image },
  { key: "toppers", label: "Toppers", icon: Trophy },
  { key: "keyDates", label: "Key Dates", icon: Calendar },
  { key: "awards", label: "Awards", icon: Award },
] as const;

export default function AdminDashboard() {
  const { user, isAdmin, logout, loading, configured } = useAuth();
  const content = useContent() as any;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (configured && !user) return <Navigate to="/admin/login" replace />;
  if (configured && !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">DPS Kanpur</p>
            <h1 className="text-xl font-bold text-primary flex items-center gap-2"><Database className="w-5 h-5" /> Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm"><Link to="/">View Site</Link></Button>
            <Button onClick={logout} variant="destructive" size="sm"><LogOut className="w-4 h-4" /> Logout</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {!configured && (
          <div className="mb-6 p-4 rounded-2xl bg-gold/15 border border-gold/30 text-sm">
            <strong className="text-primary">Demo mode.</strong> Firebase isn't configured. Add VITE_FIREBASE_* env vars + Cloudinary settings (see README) to enable real CRUD operations.
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s) => {
            const items = content[s.key] ?? [];
            return (
              <div key={s.key} className="rounded-2xl bg-card border p-6 shadow-card hover-lift">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><s.icon className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.key}</p>
                    <h2 className="font-semibold text-lg">{s.label}</h2>
                  </div>
                  <span className="ml-auto text-2xl font-bold text-gradient-primary">{items.length}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Manage {s.label.toLowerCase()} via Firestore. Connect Firebase to enable Create, Edit, Delete actions and Cloudinary uploads.</p>
                <Button disabled={!configured} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary-glow">Manage {s.label}</Button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
