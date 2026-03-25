import { useState } from "react";
import { Plus, Search, MoreHorizontal, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  availability: string;
  status: "Available" | "On Leave" | "Busy";
}

const initialDoctors: Doctor[] = [
  { id: 1, name: "Dr. Sarah Smith", specialization: "Cardiology", phone: "+1 555-0101", email: "sarah@medicore.com", availability: "Mon-Fri", status: "Available" },
  { id: 2, name: "Dr. Raj Patel", specialization: "Neurology", phone: "+1 555-0102", email: "raj@medicore.com", availability: "Mon-Thu", status: "Available" },
  { id: 3, name: "Dr. Emily Wilson", specialization: "Pediatrics", phone: "+1 555-0103", email: "emily@medicore.com", availability: "Tue-Sat", status: "Busy" },
  { id: 4, name: "Dr. James Lee", specialization: "Orthopedics", phone: "+1 555-0104", email: "james@medicore.com", availability: "Mon-Fri", status: "On Leave" },
  { id: 5, name: "Dr. Priya Kumar", specialization: "Dermatology", phone: "+1 555-0105", email: "priya@medicore.com", availability: "Wed-Sun", status: "Available" },
  { id: 6, name: "Dr. Michael Chen", specialization: "Oncology", phone: "+1 555-0106", email: "michael@medicore.com", availability: "Mon-Fri", status: "Available" },
];

const statusStyle: Record<string, string> = {
  Available: "bg-success/10 text-success border-0",
  "On Leave": "bg-warning/10 text-warning border-0",
  Busy: "bg-destructive/10 text-destructive border-0",
};

export default function Doctors() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", specialization: "", phone: "", email: "", availability: "Mon-Fri" });

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name) return;
    setDoctors(prev => [...prev, { ...form, id: Date.now(), status: "Available" as const }]);
    setForm({ name: "", specialization: "", phone: "", email: "", availability: "Mon-Fri" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
          <p className="text-sm text-muted-foreground mt-1">{doctors.length} doctors registered</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Doctor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Doctor</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. John Doe" /></div>
              <div><Label>Specialization</Label><Input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} placeholder="Cardiology" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555-0100" /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="doctor@medicore.com" /></div>
              </div>
              <div><Label>Availability</Label><Input value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))} placeholder="Mon-Fri" /></div>
              <Button onClick={handleAdd} className="w-full">Add Doctor</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors..." className="pl-10" />
      </div>

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
    </div>
  );
}
