import { useEffect, useState } from "react";
import { Users, Stethoscope, CalendarDays, DollarSign, TrendingUp, Activity } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 47000 },
  { month: "May", revenue: 53000 },
  { month: "Jun", revenue: 59000 },
  { month: "Jul", revenue: 62000 },
];

const patientData = [
  { month: "Jan", patients: 120 },
  { month: "Feb", patients: 145 },
  { month: "Mar", patients: 162 },
  { month: "Apr", patients: 178 },
  { month: "May", patients: 195 },
  { month: "Jun", patients: 220 },
  { month: "Jul", patients: 248 },
];

const statusColor: Record<string, string> = {
  Completed: "bg-success/10 text-success",
  "In Progress": "bg-info/10 text-info",
  Pending: "bg-warning/10 text-warning",
  Scheduled: "bg-primary/10 text-primary",
};

interface DashStats {
  patients: number;
  doctors: number;
  todayAppointments: number;
  revenue: number;
  recentAppointments: { patient: string; doctor: string; time: string; status: string }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashStats>({ patients: 0, doctors: 0, todayAppointments: 0, revenue: 0, recentAppointments: [] });

  useEffect(() => {
    const fetchStats = async () => {
      const [pRes, dRes, aRes, iRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }),
        supabase.from("doctors").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("invoices").select("amount, status"),
      ]);

      const revenue = (iRes.data || []).filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0);
      const recent = (aRes.data || []).map(a => ({ patient: a.patient, doctor: a.doctor, time: a.time, status: a.status }));

      setStats({
        patients: pRes.count || 0,
        doctors: dRes.count || 0,
        todayAppointments: (aRes.data || []).length,
        revenue,
        recentAppointments: recent,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Total Patients" value={stats.patients.toLocaleString()} change="+12% from last month" changeType="positive" />
        <StatCard icon={Stethoscope} title="Active Doctors" value={String(stats.doctors)} change="+3 new this month" changeType="positive" />
        <StatCard icon={CalendarDays} title="Recent Appointments" value={String(stats.todayAppointments)} change="Latest 5" changeType="neutral" />
        <StatCard icon={DollarSign} title="Revenue (Paid)" value={`$${stats.revenue.toLocaleString()}`} change="+8.2% from last month" changeType="positive" iconColor="bg-success/10" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" /> Patient Growth
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <Tooltip />
              <Bar dataKey="patients" fill="hsl(174, 62%, 47%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAppointments.map((a, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{a.patient}</td>
                  <td className="py-3 px-4 text-muted-foreground">{a.doctor}</td>
                  <td className="py-3 px-4 text-muted-foreground">{a.time}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status] || ''}`}>
                      {a.status}
                    </span>
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
