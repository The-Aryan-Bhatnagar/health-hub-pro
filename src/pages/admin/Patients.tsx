import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  lastVisit: string;
}

const initialPatients: Patient[] = [
  { id: 1, name: "Sarah Johnson", age: 34, gender: "Female", phone: "+1 555-1001", address: "123 Oak St", lastVisit: "2026-03-20" },
  { id: 2, name: "Mike Chen", age: 45, gender: "Male", phone: "+1 555-1002", address: "456 Elm Ave", lastVisit: "2026-03-22" },
  { id: 3, name: "Emily Davis", age: 28, gender: "Female", phone: "+1 555-1003", address: "789 Pine Rd", lastVisit: "2026-03-18" },
  { id: 4, name: "James Brown", age: 52, gender: "Male", phone: "+1 555-1004", address: "321 Maple Dr", lastVisit: "2026-03-24" },
  { id: 5, name: "Lisa Wang", age: 39, gender: "Female", phone: "+1 555-1005", address: "654 Cedar Ln", lastVisit: "2026-03-15" },
  { id: 6, name: "Robert Taylor", age: 61, gender: "Male", phone: "+1 555-1006", address: "987 Birch Ct", lastVisit: "2026-03-10" },
];

export default function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", phone: "", address: "" });

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name) return;
    setPatients(prev => [...prev, { ...form, id: Date.now(), age: Number(form.age), lastVisit: new Date().toISOString().slice(0, 10) }]);
    setForm({ name: "", age: "", gender: "Male", phone: "", address: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} patients registered</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Register New Patient</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Age</Label><Input type="number" value={form.age} onChange={e => setForm(p => ({ ...p, age: e.target.value }))} /></div>
                <div><Label>Gender</Label><Input value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} /></div>
              </div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Register Patient</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="pl-10" />
      </div>

      <Card className="shadow-[var(--shadow-card)] border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Age</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Gender</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.age}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.gender}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
