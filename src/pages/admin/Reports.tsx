import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const appointmentData = [
  { day: "Mon", count: 18 },
  { day: "Tue", count: 24 },
  { day: "Wed", count: 20 },
  { day: "Thu", count: 28 },
  { day: "Fri", count: 22 },
  { day: "Sat", count: 12 },
  { day: "Sun", count: 6 },
];

const departmentData = [
  { name: "Cardiology", value: 28, color: "hsl(221, 83%, 53%)" },
  { name: "Neurology", value: 18, color: "hsl(174, 62%, 47%)" },
  { name: "Pediatrics", value: 22, color: "hsl(38, 92%, 50%)" },
  { name: "Orthopedics", value: 15, color: "hsl(0, 84%, 60%)" },
  { name: "Dermatology", value: 17, color: "hsl(142, 71%, 45%)" },
];

const revenueByDept = [
  { dept: "Cardiology", revenue: 28000 },
  { dept: "Neurology", revenue: 22000 },
  { dept: "Pediatrics", revenue: 18000 },
  { dept: "Orthopedics", revenue: 32000 },
  { dept: "Emergency", revenue: 15000 },
];

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Insights into hospital operations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Appointments</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-[var(--shadow-card)] border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4">Patients by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {departmentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue by Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 12 }} stroke="hsl(215, 14%, 46%)" width={100} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(174, 62%, 47%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
