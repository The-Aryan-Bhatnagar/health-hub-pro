
-- Patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL DEFAULT 0,
  gender TEXT NOT NULL DEFAULT 'Male',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  last_visit DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read patients" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update patients" ON public.patients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  availability TEXT DEFAULT 'Mon-Fri',
  status TEXT NOT NULL DEFAULT 'Available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read doctors" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert doctors" ON public.doctors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update doctors" ON public.doctors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient TEXT NOT NULL,
  doctor TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT NOT NULL DEFAULT '09:00 AM',
  status TEXT NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read appointments" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Billing / Invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_no TEXT NOT NULL,
  patient TEXT NOT NULL,
  services TEXT DEFAULT '',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update invoices" ON public.invoices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Staff table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  department TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read staff" ON public.staff FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert staff" ON public.staff FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update staff" ON public.staff FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Pharmacy / Medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  expiry DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read medicines" ON public.medicines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert medicines" ON public.medicines FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update medicines" ON public.medicines FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
