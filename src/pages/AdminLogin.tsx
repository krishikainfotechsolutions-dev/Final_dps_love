import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const { login, configured, user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  // Already logged in → go straight to dashboard
  if (!authLoading && user) return <Navigate to="/admin/dashboard" replace />;
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, pw);
      toast({ title: "Welcome back" });
      nav("/admin/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.message ?? "Check credentials", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-hero text-primary-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 shadow-elegant text-foreground">
        <Link to="/" className="text-xs inline-flex items-center gap-1 text-primary hover:underline"><ArrowLeft className="w-3 h-3" /> Back to site</Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground flex items-center justify-center"><Shield /></div>
          <div>
            <h1 className="text-xl font-bold">Admin Login</h1>
            <p className="text-xs text-muted-foreground">DPS Kanpur — staff only</p>
          </div>
        </div>
        {!configured && (
          <p className="mt-4 text-xs p-3 rounded-lg bg-gold/15 border border-gold/30 text-foreground">
            Firebase isn't configured yet. Add VITE_FIREBASE_* env vars to enable login.
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading || !configured} className="w-full bg-primary text-primary-foreground hover:bg-primary-glow">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
