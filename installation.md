# Sehat Medika - Complete Installation Guide

## Prerequisites
- Node.js 18+
- Git installed
- GitHub account
- Vercel account (connects with GitHub)
- Supabase account
- Discord account (for OAuth)

---

## Step 1: GitHub Repository Setup

### 1.1 Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `sehat-medika-frontend`
3. Description: `Sehat Medika Hospital Management System`
4. Choose: **Public** or **Private**
5. ✅ Check **Add a README file** (optional)
6. Click **Create repository**

### 1.2 Initialize Git in Your Project
```bash
# Navigate to project root (not frontend folder)
cd H:/belajar/claude

# Initialize git
git init

# Add all files
git add .

# Create .gitignore for node_modules, dist, env files
echo "node_modules/
dist/
.env.local
.DS_Store" > .gitignore

# First commit
git commit -m "Initial commit: Sehat Medika frontend"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/satumimpiroxwoodhospital-pixel/sehat-medika-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.3 Verify on GitHub
- Refresh your GitHub repository page
- All files should be visible
- `frontend/` folder contains the React app
- `.gitignore` should exclude `node_modules/`, `dist/`, `.env.local`

---

## Step 2: Supabase Setup

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name: `sehat-medika`
3. Database Password: (generate strong password, save it!)
4. Region: Choose closest to your location
5. Click **Create new project**
6. Wait 1-2 minutes for project to initialize

### 2.2 Enable Discord OAuth in Supabase
1. In Supabase dashboard, go to **Authentication** (left sidebar)
2. Click **Providers** → **Discord**
3. Enable the Discord provider
4. Go to [discord.com/developers](https://discord.com/developers)
   - Create app or select existing → **OAuth2** → **General**
   - Copy **Application ID** (Client ID) and **Client Secret**
5. Back in Supabase Discord settings:
   - Paste **Client ID** and **Client Secret**
   - **Redirect URL** is auto-configured by Supabase
6. Click **Save**

### 2.3 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **+ New query**
3. Copy entire contents of `frontend/supabase/schema.sql`
4. Click **Run** → confirm by clicking **Run** again
5. You should see: `Success. No rows returned`

### 2.4 Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `patients`
   - `appointments`
   - `medical_records`
   - `jobs`
   - `applications`
   - `admin_users`

### 2.5 Get API Credentials
1. Go to **Project Settings** (gear icon, top left)
2. Click **API** (in the settings submenu)
3. Under **Project URL**: copy the URL (e.g., `https://xxx.supabase.co`)
4. Under **Project API Keys** → `anon` `public`: copy the key (starts with `eyJ...`)

**Save these for Step 3!**

### 2.6 Create Admin Users in Supabase Auth
**Option A: Via Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email (e.g., `admin@sehatmedika.com`) and password
4. After creating, note the **User UUID** (copy it)
5. Go to **Table Editor** → `admin_users` table
6. Insert row with:
   - `id`: any unique string (e.g., `'1'`)
   - `user_id`: paste the User UUID from step 4
   - `name`: e.g., `'Dr. Admin'`
   - `role`: `'Super Admin'`
   - `permissions`: `ARRAY['*']`

**Option B: Via SQL Editor**
```sql
-- First, create user in Supabase Auth (do this in Dashboard → Authentication → Users)
-- Then link to admin_users table:

-- Replace 'USER_UUID_FROM_AUTH' with the actual UUID from Authentication → Users
INSERT INTO admin_users (id, user_id, name, role, permissions) VALUES
  ('1', 'USER_UUID_FROM_AUTH', 'Dr. Admin', 'Super Admin', ARRAY['*']),
  ('2', 'USER_UUID_FROM_AUTH_2', 'Dr. Staff', 'Admin', ARRAY['services:*', 'doctors:*', 'appointments:*', 'jobs:*', 'applications:*', 'pages:*']),
  ('3', 'USER_UUID_FROM_AUTH_3', 'Dr. Johnson', 'Doctor', ARRAY['appointments:read', 'appointments:update', 'profile:update']);
```

---

## Step 3: Environment Variables Setup

### 3.1 Local Development (`.env.local`)
Create `frontend/.env.local` file:
```bash
# Copy from frontend/.env.example and fill in:

# Supabase (from Step 2.5)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Verify `.gitignore` Excludes Env Files
```bash
# Check that .env.local is in .gitignore
cat .gitignore
# Should show: .env.local
```

---

## Step 4: Local Development & Testing

### 4.1 Install Dependencies
```bash
cd frontend
npm install
```

### 4.2 Start Dev Server
```bash
npm run dev
```
App runs at `http://localhost:5173` (or `http://localhost:5174`)

### 4.3 Test the App
1. **Homepage**: `http://localhost:5173/`
2. **Login Choice**: Click "Login" → should show Staff/Patient options
3. **Patient Login**: Click "Patient Login" → "Login with Discord"
   - Should redirect to Discord OAuth (via Supabase)
   - After authorization, redirects back to patient dashboard
4. **Admin Login**: Go to `/admin/login`
   - Use email + password (created in Step 2.6)
   - Super Admin: `admin@sehatmedika.com` / `admin123`
   - Admin: `staff@sehatmedika.com` / `staff123`
   - Doctor: `doctor@sehatmedika.com` / `doctor123`

### 4.4 Push to GitHub (after testing)
```bash
cd ..
git add .
git commit -m "Configure: Supabase Auth + env vars"
git push origin main
```

---

## Step 5: Deploy to Vercel

### 5.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Click **Continue with GitHub** (authorize if needed)
3. Find `sehat-medika-frontend` repository → Click **Import**
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (click "Edit" to change)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 5.2 Set Environment Variables in Vercel
In the deployment setup page, scroll to **Environment Variables**:

| Name | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | From Step 2.5 |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | From Step 2.5 |

**Note**: Do NOT add `DISCORD_CLIENT_SECRET` or `DISCORD_REDIRECT_URI` — Supabase handles Discord OAuth automatically.

Click **Deploy**

### 5.3 Wait for Deployment
1. Vercel will:
   - Clone from GitHub
   - Install dependencies
   - Run build (`npm run build`)
   - Deploy static files
2. After ~2 minutes: **Congratulations! Your project is deployed**

### 5.4 Update Discord OAuth Redirect (in Supabase)
1. Go to [supabase.com](https://supabase.com) → Your Project → **Authentication**
2. Click **Providers** → **Discord**
3. Add redirect URL: `https://sehat-medika-frontend.vercel.app/auth/v1/callback`
4. Click **Save**

---

## Step 6: Post-Deployment Checklist

### 6.1 Verify Live Site
- [ ] Open your Vercel URL
- [ ] Homepage loads correctly
- [ ] Login page works (`/login`)
- [ ] Patient Discord OAuth flow works
- [ ] Admin login works (`/admin/login`)
- [ ] Dashboard shows data

### 6.2 Verify Supabase Connection
- [ ] Patients can be created via profile form
- [ ] Appointments can be booked
- [ ] Jobs are visible in careers page
- [ ] Applications can be submitted

### 6.3 Security Check
- [ ] `.env.local` is NOT in GitHub (check on github.com)
- [ ] Supabase anon key has RLS enabled (check Supabase dashboard)
- [ ] Admin passwords are stored in Supabase Auth (not in `admin_users` table)

---

## Complete File Structure

```
sehat-medika-frontend/           # GitHub repository root
├── frontend/                    # Vercel deployment root
│   ├── api/                    # Vercel serverless functions (data API)
│   │   ├── patients.ts
│   │   ├── appointments.ts
│   │   ├── jobs.ts
│   │   ├── applications.ts
│   │   └── medical-records.ts
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   ├── src/                   # React frontend
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/            # Zustand stores (Supabase Auth)
│   │   └── App.tsx
│   ├── supabase/
│   │   └── schema.sql          # Database schema
│   ├── public/
│   ├── vercel.json              # Vercel config
│   ├── .env.example            # Template (committed to GitHub)
│   ├── .env.local             # Local dev (NOT committed)
│   ├── installation.md         # This file
│   └── package.json
├── .gitignore                 # Excludes node_modules, .env.local
└── README.md                   # (optional)
```

---

## Quick Command Reference

```bash
# Local development
cd frontend
npm install
npm run dev              # Starts at http://localhost:5173

# Git workflow
git status                    # Check changes
git add .                    # Stage all
git commit -m "message"       # Commit
git push origin main           # Push to GitHub → triggers Vercel deploy

# Build test
npm run build                 # Test production build locally

# Vercel CLI (optional)
npm i -g vercel
vercel                         # Deploy manually
vercel env pull .env.local     # Pull env vars from Vercel
```

---

## Troubleshooting

### Build Fails on Vercel
- Check all env vars are set in Vercel dashboard
- Check `vercel.json` has correct `buildCommand` and `outputDirectory`
- Check `frontend/package.json` has `build` script

### Discord OAuth Not Redirecting
- Verify Discord provider is enabled in Supabase Dashboard
- Check redirect URL in Supabase: `https://your-app.vercel.app/auth/v1/callback`
- Clear browser cookies and try again

### Supabase Connection Error
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check RLS policies in Supabase dashboard
- Run `supabase/schema.sql` again if tables missing

### Admin Login Failed
- Verify admin user exists in Supabase Authentication → Users
- Check that `admin_users` table has the correct `user_id` linked to auth user
- Verify email/password is correct
