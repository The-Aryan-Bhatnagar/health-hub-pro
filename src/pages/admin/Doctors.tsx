import { useState, useEffect } from "react";
import { Plus, Search, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  availability: string;
  status: string;
}

const statusStyle: Record<string, string> = {
  Available: "bg-success/10 text-success border-0",
  "On Leave": "bg-warning/10 text-warning border-0",
  Busy: "bg-destructive/10 text-destructive border-0",
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", specialization: "", phone: "", email: "", availability: "Mon-Fri" });

  const fetchDoctors = async () => {
    const { data, error } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load doctors"); return; }
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDoctors(); }, []);

  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!form.name) return;
    const { error } = await supabase.from("doctors").insert({ ...form, status: "Available" });
    if (error) { toast.error("Failed to add doctor"); return; }
    toast.success("Doctor added");
    setForm({ name: "", specialization: "", phone: "", email: "", availability: "Mon-Fri" });
    setOpen(false);
    fetchDoctors();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">{doctors.length} doctors registered</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Doctor</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Doctor</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. John Doe" /></div>
              <div><Label>Specialization</Label><Input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} placeholder="Cardiology" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
              </div>
              <div><Label>Availability</Label><Input value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Add Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." className="pl-10" />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => (
            <Card key={d.id} className="p-5 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{d.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialization}</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusStyle[d.status]}>{d.status}</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><Phone className="h-3 w-3" />{d.phone}</p>
                <p className="flex items-center gap-2"><Mail className="h-3 w-3" />{d.email}</p>
                <p>📅 {d.availability}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
