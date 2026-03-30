import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  last_visit: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", phone: "", address: "" });

  const fetchPatients = async () => {
    const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load patients"); return; }
    setPatients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!form.name) return;
    const { error } = await supabase.from("patients").insert({
      name: form.name, age: Number(form.age), gender: form.gender, phone: form.phone, address: form.address, last_visit: new Date().toISOString().slice(0, 10),
    });
    if (error) { toast.error("Failed to add patient"); return; }
    toast.success("Patient registered");
    setForm({ name: "", age: "", gender: "Male", phone: "", address: "" });
    setOpen(false);
    fetchPatients();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} patients registered</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Patient</Button></DialogTrigger>
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
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.age}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.gender}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.phone}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.last_visit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
