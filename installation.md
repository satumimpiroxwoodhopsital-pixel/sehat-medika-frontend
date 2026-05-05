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

### 2.2 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **+ New query**
3. Copy entire contents of `frontend/supabase/schema.sql`
4. Click **Run** → confirm by clicking **Run** again
5. You should see: `Success. No rows returned`

### 2.3 Verify Tables Created
1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `patients`
   - `appointments`
   - `medical_records`
   - `jobs`
   - `applications`
   - `admin_users`

### 2.4 Get API Credentials
1. Go to **Project Settings** (gear icon, top left)
2. Click **API** (in the settings submenu)
3. Under **Project URL**: copy the URL (e.g., `https://xxx.supabase.co`)
4. Under **Project API Keys** → `anon` `public`: copy the key (starts with `eyJ...`)

**Save these for Step 4!**

### 2.5 Add Demo Admin Users (Optional - for testing)
```sql
-- Run this in SQL Editor to add demo admin users
INSERT INTO admin_users (id, discord_id, name, password, role, permissions) VALUES
  ('1', 'admin#0001', 'Dr. Admin', 'admin123', 'Super Admin', ARRAY['*']),
  ('2', 'staff#0002', 'Dr. Staff', 'staff123', 'Admin', ARRAY['services:*', 'doctors:*', 'appointments:*', 'jobs:*', 'applications:*', 'pages:*']),
  ('3', 'doctor#0003', 'Dr. Johnson', 'doctor123', 'Doctor', ARRAY['appointments:read', 'appointments:update', 'profile:update']);
```

---

## Step 3: Discord OAuth Setup

### 3.1 Create Discord Application
1. Go to [discord.com/developers](https://discord.com/developers)
2. Click **New Application**
3. Name: `Sehat Medika` → Click **Create**
4. **Copy** the **Application ID** (you'll need this later)

### 3.2 Get Client Secret
1. In your app page, go to **OAuth2** → **General**
2. Under **CLIENT SECRET**, click **Reset Secret**
3. **Copy** the secret immediately (you won't see it again!)

### 3.3 Set Redirect URIs
1. In **OAuth2** → **General**, scroll to **Redirects**
2. Click **Add Redirect**
3. For local dev, add:
   ```
   http://localhost:5174/api/auth/discord/callback
   ```
4. For production (after Vercel deploy), add:
   ```
   https://your-app.vercel.app/api/auth/discord/callback
   ```
5. Click **Save Changes** at bottom

**Save Client ID + Secret for Step 4!**

---

## Step 4: Environment Variables Setup

### 4.1 Local Development (`.env.local`)
Create `frontend/.env.local` file:
```bash
# Copy from frontend/.env.example and fill in:

# Supabase (from Step 2.4)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Discord OAuth (from Step 3)
VITE_DISCORD_CLIENT_ID=1500262153054322910
DISCORD_CLIENT_SECRET=nexnbTRFEhiO2u3m-uiFpOHPlnqxKpmq
DISCORD_REDIRECT_URI=http://localhost:5174/api/auth/discord/callback
```

### 4.2 Verify `.gitignore` Excludes Env Files
```bash
# Check that .env.local is in .gitignore
cat .gitignore
# Should show: .env.local
```

---

## Step 5: Local Development & Testing

### 5.1 Install Dependencies
```bash
cd frontend
npm install
```

### 5.2 Start Dev Server
```bash
npm run dev
```
App runs at `http://localhost:5174`

### 5.3 Test the App
1. **Homepage**: `http://localhost:5174/`
2. **Login Choice**: Click "Login" → should show Staff/Patient options
3. **Patient Login**: Click "Patient Login" → "Login with Discord"
   - Should redirect to Discord OAuth
   - After authorization, redirects back to patient dashboard
4. **Admin Login**: Go to `/admin/login`
   - Use Discord ID + password (from Step 2.5)
   - Super Admin: `admin#0001` / `admin123`
   - Admin: `staff#0002` / `staff123`
   - Doctor: `doctor#0003` / `doctor123`

### 5.4 Push to GitHub (after testing)
```bash
cd ..
git add .
git commit -m "Configure: Supabase + Discord OAuth + env vars"
git push origin main
```

---

## Step 6: Deploy to Vercel

### 6.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Click **Continue with GitHub** (authorize if needed)
3. Find `sehat-medika-frontend` repository → Click **Import**
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (click "Edit" to change)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`

### 6.2 Set Environment Variables in Vercel
In the deployment setup page, scroll to **Environment Variables**:

| Name | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | From Step 2.4 |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | From Step 2.4 |
| `VITE_DISCORD_CLIENT_ID` | `1500262153054322910` | From Step 3.1 |
| `DISCORD_CLIENT_SECRET` | `nexnbTRFEhiO2u3m...` | From Step 3.2 |
| `DISCORD_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/discord/callback` | Replace with your Vercel URL |

Click **Deploy**

### 6.3 Wait for Deployment
1. Vercel will:
   - Clone from GitHub
   - Install dependencies
   - Run build (`npm run build`)
   - Deploy serverless functions
2. After ~2 minutes: **Congratulations! Your project is deployed**

### 6.4 Update Discord Redirect URI
1. Copy your Vercel URL (e.g., `https://sehat-medika.vercel.app`)
2. Go to [discord.com/developers](https://discord.com/developers)
3. Select your app → **OAuth2** → **General**
4. Add redirect URI:
   ```
   https://your-app.vercel.app/api/auth/discord/callback
   ```
5. Click **Save Changes**

---

## Step 7: Post-Deployment Checklist

### 7.1 Verify Live Site
- [ ] Open your Vercel URL
- [ ] Homepage loads correctly
- [ ] Login page works (`/login`)
- [ ] Patient Discord OAuth flow works
- [ ] Admin login works (`/admin/login`)
- [ ] Dashboard shows data

### 7.2 Verify API Routes
Test these URLs (should return JSON):
- `https://your-app.vercel.app/api/jobs` → should return jobs array
- `https://your-app.vercel.app/api/patients` → should return patients array

### 7.3 Check Supabase Connection
- [ ] Patients can be created via profile form
- [ ] Appointments can be booked
- [ ] Jobs are visible in careers page
- [ ] Applications can be submitted

### 7.4 Security Check
- [ ] `.env.local` is NOT in GitHub (check on github.com)
- [ ] Discord Client Secret is only in Vercel env vars (not in code)
- [ ] Supabase anon key has RLS enabled (check Supabase dashboard)

---

## Complete File Structure

```
sehat-medika-frontend/           # GitHub repository root
├── frontend/                    # Vercel deployment root
│   ├── api/                    # Vercel serverless functions
│   │   ├── patients.ts
│   │   ├── appointments.ts
│   │   ├── jobs.ts
│   │   ├── applications.ts
│   │   ├── medical-records.ts
│   │   ├── auth/discord/
│   │   │   ├── oauth.ts
│   │   │   └── callback.ts
│   │   ├── admin-auth.ts
│   │   └── admin-profile.ts
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   ├── src/                   # React frontend
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/            # Zustand stores (API-connected)
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

## API Routes Reference

| Route | Method | Description |
|---|---|---|
| `/api/patients` | GET, POST, PUT, DELETE | Patient CRUD |
| `/api/appointments` | GET, POST, PUT | Appointment CRUD |
| `/api/jobs` | GET, POST, PUT | Job CRUD (public read) |
| `/api/applications` | GET, POST, PUT, DELETE | Application CRUD |
| `/api/medical-records` | GET, POST, PUT, DELETE | Medical records |
| `/api/auth/discord/oauth` | GET | Discord OAuth2 flow |
| `/api/auth/discord/callback` | GET | OAuth callback |
| `/api/admin-auth` | POST | Admin login (Discord ID + password) |
| `/api/admin-profile` | GET | Get admin profile |

---

## Quick Command Reference

```bash
# Local development
cd frontend
npm install
npm run dev              # Starts at http://localhost:5174

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
- Verify redirect URI in Discord Developer Portal matches exactly
- Check `VITE_DISCORD_CLIENT_ID` is set correctly
- Clear browser cookies and try again

### Supabase Connection Error
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check RLS policies in Supabase dashboard
- Run `supabase/schema.sql` again if tables missing

### 404 on API Routes
- Vercel serverless functions need `api/` folder at root of deployment
- Check `vercel.json` rewrites are correct
- Redeploy after changing API files
