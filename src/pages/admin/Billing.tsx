import { useState } from "react";
import { Plus, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Invoice {
  id: number;
  invoiceNo: string;
  patient: string;
  services: string;
  amount: number;
  date: string;
  status: string;
}

const initialInvoices: Invoice[] = [
  { id: 1, invoiceNo: "INV-001", patient: "Sarah Johnson", services: "Consultation, ECG", amount: 350, date: "2026-03-25", status: "Paid" },
  { id: 2, invoiceNo: "INV-002", patient: "Mike Chen", services: "MRI Scan", amount: 1200, date: "2026-03-24", status: "Pending" },
  { id: 3, invoiceNo: "INV-003", patient: "Emily Davis", services: "Blood Test, X-Ray", amount: 480, date: "2026-03-23", status: "Paid" },
  { id: 4, invoiceNo: "INV-004", patient: "James Brown", services: "Surgery Consultation", amount: 750, date: "2026-03-22", status: "Overdue" },
  { id: 5, invoiceNo: "INV-005", patient: "Lisa Wang", services: "Dental Cleaning", amount: 200, date: "2026-03-21", status: "Paid" },
];

const statusStyle: Record<string, string> = {
  Paid: "bg-success/10 text-success border-0",
  Pending: "bg-warning/10 text-warning border-0",
  Overdue: "bg-destructive/10 text-destructive border-0",
};

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patient: "", services: "", amount: "" });

  const filtered = invoices.filter(i => i.patient.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!form.patient) return;
    const no = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
    setInvoices(prev => [...prev, { ...form, id: Date.now(), invoiceNo: no, amount: Number(form.amount), date: new Date().toISOString().slice(0, 10), status: "Pending" }]);
    setForm({ patient: "", services: "", amount: "" });
    setOpen(false);
  };

  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Total Revenue: <span className="text-success font-semibold">${totalRevenue.toLocaleString()}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Create Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Generate Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Patient Name</Label><Input value={form.patient} onChange={e => setForm(p => ({ ...p, patient: e.target.value }))} /></div>
              <div><Label>Services</Label><Input value={form.services} onChange={e => setForm(p => ({ ...p, services: e.target.value }))} placeholder="Consultation, X-Ray" /></div>
              <div><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Generate Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="pl-10" />
      </div>

      <Card className="shadow-[var(--shadow-card)] border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Services</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary">{i.invoiceNo}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{i.patient}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.services}</td>
                  <td className="py-3 px-4 font-semibold text-foreground">${i.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.date}</td>
                  <td className="py-3 px-4"><Badge variant="outline" className={statusStyle[i.status]}>{i.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
