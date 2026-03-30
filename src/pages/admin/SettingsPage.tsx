import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

export default function SettingsPage() {
  const [hospitalName, setHospitalName] = useState("MediCore General Hospital");
  const [email, setEmail] = useState("MediCore@gmail.com");
  const [phone, setPhone] = useState("+1 555-0000");

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage hospital configuration</p>
      </div>

      <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Hospital Information</h3>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
          <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{hospitalName}</p>
            <p className="text-sm text-muted-foreground">Hospital Management System</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><Label>Hospital Name</Label><Input value={hospitalName} onChange={e => setHospitalName(e.target.value)} /></div>
          <div><Label>Admin Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
        </div>
        <Button>Save Changes</Button>
      </Card>
    </div>
  );
}
