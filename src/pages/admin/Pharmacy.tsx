import { useState, useEffect } from "react";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiry: string;
}

export default function Pharmacy() {
  const [meds, setMeds] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", category: "", quantity: "", price: "", expiry: "" });

  const fetchMeds = async () => {
    const { data, error } = await supabase.from("medicines").select("*").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load medicines"); return; }
    setMeds(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMeds(); }, []);

  const filtered = meds.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!form.name) return;
    const { error } = await supabase.from("medicines").insert({
      name: form.name, category: form.category, quantity: Number(form.quantity), price: Number(form.price), expiry: form.expiry || null,
    });
    if (error) { toast.error("Failed to add medicine"); return; }
    toast.success("Medicine added");
    setForm({ name: "", category: "", quantity: "", price: "", expiry: "" });
    setOpen(false);
    fetchMeds();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy</h1>
          <p className="text-sm text-muted-foreground mt-1">{meds.length} medicines in stock</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Medicine</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Medicine</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Medicine Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} /></div>
                <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
              </div>
              <div><Label>Expiry Date</Label><Input type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Add Medicine</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicines..." className="pl-10" />
      </div>

      <Card className="shadow-[var(--shadow-card)] border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Qty</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expiry</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{m.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{m.category}</td>
                  <td className="py-3 px-4 text-foreground">{m.quantity}</td>
                  <td className="py-3 px-4 text-foreground">₹{Number(m.price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-muted-foreground">{m.expiry}</td>
                  <td className="py-3 px-4">
                    {m.quantity < 50 ? (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-0">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Low
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-success/10 text-success border-0">In Stock</Badge>
                    )}
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
