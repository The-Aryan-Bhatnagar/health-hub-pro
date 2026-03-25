import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Staff {
  id: number;
  name: string;
  role: string;
  department: string;
  phone: string;
  status: string;
}

const initialStaff: Staff[] = [
  { id: 1, name: "Anna Rodriguez", role: "Head Nurse", department: "ICU", phone: "+1 555-2001", status: "Active" },
  { id: 2, name: "Tom Baker", role: "Receptionist", department: "Front Desk", phone: "+1 555-2002", status: "Active" },
  { id: 3, name: "Grace Kim", role: "Lab Technician", department: "Pathology", phone: "+1 555-2003", status: "Active" },
  { id: 4, name: "David Okafor", role: "Nurse", department: "Emergency", phone: "+1 555-2004", status: "On Leave" },
  { id: 5, name: "Maria Santos", role: "Pharmacist", department: "Pharmacy", phone: "+1 555-2005", status: "Active" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-success/10 text-success border-0",
  "On Leave": "bg-warning/10 text-warning border-0",
};

export default function StaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", department: "", phone: "" });

  const filtered = staff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.name) return;
    setStaff(prev => [...prev, { ...form, id: Date.now(), status: "Active" }]);
    setForm({ name: "", role: "", department: "", phone: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground mt-1">{staff.length} staff members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Role</Label><Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Nurse, Receptionist..." /></div>
              <div><Label>Department</Label><Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Add Staff</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="pl-10" />
      </div>

      <Card className="shadow-[var(--shadow-card)] border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.role}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.department}</td>
                  <td className="py-3 px-4 text-muted-foreground">{s.phone}</td>
                  <td className="py-3 px-4"><Badge variant="outline" className={statusStyle[s.status]}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
