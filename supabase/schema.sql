-- Patients
create table if not exists patients (
  id text primary key,
  mrn text unique,
  name text not null,
  cid text default '',
  discord_id text,
  date_of_birth text,
  gender text,
  blood_type text,
  phone text default '',
  allergies text[] default '{}',
  status text default 'active',
  registration_date text
);

-- Appointments
create table if not exists appointments (
  id text primary key,
  ref_number text,
  patient_name text,
  phone text,
  discord_id text,
  patient_discord_id text,
  service_id text,
  doctor_id text,
  doctor_name text,
  date text,
  time_slot text,
  status text check (status in ('pending','confirmed','cancelled','completed')),
  notes text
);

-- Medical Records
create table if not exists medical_records (
  id text primary key,
  patient_id text references patients(id),
  patient_name text,
  patient_mrn text,
  doctor_id text,
  doctor_name text,
  visit_date text,
  visit_type text check (visit_type in ('outpatient','inpatient','emergency','checkup')),
  diagnosis text,
  symptoms text[],
  treatment text,
  prescription jsonb,
  notes text,
  follow_up_date text,
  status text check (status in ('draft','finalized'))
);

-- Jobs
create table if not exists jobs (
  id text primary key,
  title text,
  department text,
  type text,
  location text,
  description text,
  requirements text[],
  form_questions jsonb,
  is_published boolean default true,
  is_closed boolean default false,
  posted_date text
);

-- Applications
create table if not exists applications (
  id text primary key,
  job_id text references jobs(id),
  applicant_name text,
  discord_id text,
  phone text,
  cv_path text,
  cover_letter text,
  form_answers jsonb,
  status text check (status in ('new','reviewed','interviewed','rejected','hired')),
  applied_at text
);

-- Admin Users
create table if not exists admin_users (
  id text primary key,
  discord_id text unique,
  name text,
  password text,
  role text,
  permissions text[]
);

-- Enable RLS
alter table patients enable row level security;
alter table appointments enable row level security;
alter table medical_records enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;

-- Public read for jobs
create policy "Jobs public read" on jobs for select using (true);
