import { useState, useEffect } from "react";
import { Plus, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Invoice {
  id: string;
  invoice_no: string;
  patient: string;
  services: string;
  amount: number;
  date: string;
  status: string;
}

const statusStyle: Record<string, string> = {
  Paid: "bg-success/10 text-success border-0",
  Pending: "bg-warning/10 text-warning border-0",
  Overdue: "bg-destructive/10 text-destructive border-0",
};

const downloadInvoice = (invoice: Invoice) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text("MediCore", 20, 25);
  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125);
  doc.text("Hospital Management System", 20, 32);

  // Invoice title
  doc.setFontSize(16);
  doc.setTextColor(33, 37, 41);
  doc.text(`Invoice: ${invoice.invoice_no}`, 20, 50);

  // Info
  doc.setFontSize(11);
  doc.setTextColor(73, 80, 87);
  doc.text(`Date: ${invoice.date}`, 20, 62);
  doc.text(`Patient: ${invoice.patient}`, 20, 70);
  doc.text(`Status: ${invoice.status}`, 20, 78);

  // Table
  autoTable(doc, {
    startY: 90,
    head: [["Services", "Amount"]],
    body: [[invoice.services, `₹${Number(invoice.amount).toLocaleString("en-IN")}`]],
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 11 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 120;

  // Total
  doc.setFontSize(13);
  doc.setTextColor(33, 37, 41);
  doc.text(`Total: ₹${Number(invoice.amount).toLocaleString("en-IN")}`, 20, finalY + 15);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing MediCore Hospital.", 20, 280);

  doc.save(`${invoice.invoice_no}.pdf`);
  toast.success(`Downloaded ${invoice.invoice_no}`);
};

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ patient: "", services: "", amount: "" });

  const fetchInvoices = async () => {
    const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load invoices"); return; }
    setInvoices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, []);

  const filtered = invoices.filter(i => i.patient.toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0);

  const handleAdd = async () => {
    if (!form.patient) return;
    const no = `INV-${String(invoices.length + 1).padStart(3, "0")}`;
    const { error } = await supabase.from("invoices").insert({
      invoice_no: no, patient: form.patient, services: form.services, amount: Number(form.amount), date: new Date().toISOString().slice(0, 10), status: "Pending",
    });
    if (error) { toast.error("Failed to create invoice"); return; }
    toast.success("Invoice created");
    setForm({ patient: "", services: "", amount: "" });
    setOpen(false);
    fetchInvoices();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Total Revenue: <span className="text-success font-semibold">₹{totalRevenue.toLocaleString("en-IN")}</span></p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Create Invoice</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Generate Invoice</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Patient Name</Label><Input value={form.patient} onChange={e => setForm(p => ({ ...p, patient: e.target.value }))} /></div>
              <div><Label>Services</Label><Input value={form.services} onChange={e => setForm(p => ({ ...p, services: e.target.value }))} placeholder="Consultation, X-Ray" /></div>
              <div><Label>Amount (₹)</Label><Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
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
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : filtered.map(i => (
                <tr key={i.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary">{i.invoice_no}</td>
                  <td className="py-3 px-4 font-medium text-foreground">{i.patient}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.services}</td>
                  <td className="py-3 px-4 font-semibold text-foreground">₹{Number(i.amount).toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.date}</td>
                  <td className="py-3 px-4"><Badge variant="outline" className={statusStyle[i.status]}>{i.status}</Badge></td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" onClick={() => downloadInvoice(i)} className="text-primary hover:text-primary/80">
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
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
