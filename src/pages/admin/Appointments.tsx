import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
}

const initialAppointments: Appointment[] = [
  { id: 1, patient: "Sarah Johnson", doctor: "Dr. Smith", date: "2026-03-25", time: "09:00 AM", status: "Completed" },
  { id: 2, patient: "Mike Chen", doctor: "Dr. Patel", date: "2026-03-25", time: "10:30 AM", status: "In Progress" },
  { id: 3, patient: "Emily Davis", doctor: "Dr. Wilson", date: "2026-03-25", time: "11:00 AM", status: "Pending" },
  { id: 4, patient: "James Brown", doctor: "Dr. Lee", date: "2026-03-25", time: "02:00 PM", status: "Pending" },
  { id: 5, patient: "Lisa Wang", doctor: "Dr. Kumar", date: "2026-03-26", time: "09:30 AM", status: "Scheduled" },
  { id: 6, patient: "Robert Taylor", doctor: "Dr. Chen", date: "2026-03-26", time: "11:00 AM", status: "Scheduled" },
];

const statusStyle: Record<string, string> = {
  Completed: "bg-success/10 text-success border-0",
  "In Progress": "bg-info/10 text-info border-0",
  Pending: "bg-warning/10 text-warning border-0",
  Scheduled: "bg-primary/10 text-primary border-0",
  Cancelled: "bg-destructive/10 text-destructive border-0",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient: "", doctor: "", date: "", time: "" });

  const filtered = appointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.patient || !form.doctor) return;
    setAppointments(prev => [...prev, { ...form, id: Date.now(), status: "Scheduled" }]);
    setForm({ patient: "", doctor: "", date: "", time: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">{appointments.length} total appointments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Book Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Book New Appointment</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Patient Name</Label><Input value={form.patient} onChange={e => setForm(p => ({ ...p, patient: e.target.value }))} /></div>
              <div><Label>Doctor</Label><Input value={form.doctor} onChange={e => setForm(p => ({ ...p, doctor: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
                <div><Label>Time</Label><Input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="09:00 AM" /></div>
              </div>
              <Button onClick={handleAdd} className="w-full">Book Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments..." className="pl-10" />
      </div>

      <Card className="shadow-[var(--shadow-card)] border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{a.patient}</td>
                  <td className="py-3 px-4 text-muted-foreground">{a.doctor}</td>
                  <td className="py-3 px-4 text-muted-foreground">{a.date}</td>
                  <td className="py-3 px-4 text-muted-foreground">{a.time}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={statusStyle[a.status]}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
