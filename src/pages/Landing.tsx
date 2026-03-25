import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Users, CalendarDays, Receipt, Pill, BarChart3, ArrowRight, Shield, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Users, title: "Patient Management", desc: "Complete patient records, history tracking, and smart search." },
  { icon: CalendarDays, title: "Appointments", desc: "Effortless scheduling with conflict detection and reminders." },
  { icon: Receipt, title: "Billing & Invoicing", desc: "Automated billing, insurance processing, and payment tracking." },
  { icon: Pill, title: "Pharmacy", desc: "Stock management, prescriptions, and expiry tracking." },
  { icon: BarChart3, title: "Reports", desc: "Real-time analytics and exportable reports for every module." },
  { icon: Shield, title: "Secure & Reliable", desc: "Role-based access, encrypted data, and HIPAA-ready infrastructure." },
];

const stats = [
  { value: "50K+", label: "Patients Managed" },
  { value: "2K+", label: "Doctors Onboarded" },
  { value: "99.9%", label: "Uptime Guaranteed" },
  { value: "24/7", label: "Support Available" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">MediCore</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="outline" size="sm">Admin Login</Button>
            </Link>
            <Link to="/admin">
              <Button size="sm">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Smart Hospital Management
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Manage Your Hospital
              <span className="block" style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                With Intelligence
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A comprehensive platform to manage patients, doctors, appointments, billing, pharmacy, and analytics — all from one powerful dashboard.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/admin">
                <Button size="lg" className="px-8 h-12 text-base font-semibold shadow-lg">
                  Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-card">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Powerful modules designed for modern hospitals, clinics, and healthcare facilities.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-2xl bg-card border border-border/50 p-6 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center" style={{ background: "var(--gradient-hero)" }}>
          <Clock className="h-10 w-10 text-primary-foreground/70 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-foreground mb-3">Ready to Transform Your Hospital?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Get started today and experience a smarter way to manage healthcare operations.
          </p>
          <Link to="/admin">
            <Button size="lg" variant="secondary" className="px-8 h-12 text-base font-semibold">
              Access Admin Panel <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">MediCore HMS</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 MediCore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
