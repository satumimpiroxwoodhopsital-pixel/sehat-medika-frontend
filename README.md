# Sehat Medika - Hospital Management System

![Status](https://img.shields.io/badge/Status-Active-green) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite) ![React](https://img.shields.io/badge/React-61DAFB?logo=react) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase) ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)

Modern hospital management system with patient portal, staff dashboard, appointment booking, job listings, and Discord OAuth authentication.

---

## Features

### Patient Portal
- **Discord OAuth Login** - Secure login with Discord account
- **Profile Management** - Complete patient profile (name, DOB, gender, blood type, allergies)
- **Appointment Booking** - Book, view, and track appointments
- **Medical Records** - Access personal medical history
- **Job Applications** - Browse open positions and apply online
- **Application Status** - Track job application status (new → reviewed → interviewed → hired)

### Staff Dashboard (Admin)
- **Role-Based Access** - Super Admin, Admin, Doctor, Receptionist, HR, Content Manager
- **Patient Management** - View and manage patient records
- **Appointment Management** - Confirm, update, or cancel appointments
- **Medical Records** - Create and update patient medical records
- **Job Postings** - Create and manage job listings
- **Application Review** - Review and update job applications
- **User Management** - Manage staff accounts and permissions
- **CMS** - Manage page content (services, doctors, pages)

---

## Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **Build Tool** | Vite |
| **State Management** | Zustand |
| **Form Handling** | React Hook Form + Zod |
| **Backend** | Vercel Serverless Functions |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Discord OAuth2 |
| **Deployment** | Vercel |

---

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/sehat-medika-frontend.git
cd sehat-medika-frontend
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Setup Environment
Create `frontend/.env.local`:
```bash
# Supabase (get from Supabase dashboard → Settings → API)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Discord OAuth (get from https://discord.com/developers)
VITE_DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
DISCORD_REDIRECT_URI=http://localhost:5174/api/auth/discord/callback
```

### 4. Setup Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → New Query
3. Copy contents of `frontend/supabase/schema.sql` → **Run**
4. Copy URL + anon key to `.env.local`

### 5. Run Development Server
```bash
cd frontend
npm run dev
```
Open `http://localhost:5174`

---

## Project Structure

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
│   │   ├── components/        # Navbar, Footer
│   │   ├── pages/            # Home, About, Services, etc.
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── stores/           # Zustand stores (API-connected)
│   │   └── App.tsx
│   ├── supabase/
│   │   └── schema.sql          # Database schema
│   ├── vercel.json              # Vercel config
│   ├── installation.md         # Step-by-step installation guide
│   └── package.json
├── .gitignore
└── README.md
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:5174` |
| `npm run build` | Build for production (output: `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import `sehat-medika-frontend` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
5. Add environment variables (from `.env.local`)
6. Click **Deploy**

> **Full guide:** See [installation.md](frontend/installation.md)

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/patients` | GET, POST, PUT, DELETE | Patient CRUD |
| `/api/appointments` | GET, POST, PUT | Appointment CRUD |
| `/api/jobs` | GET, POST, PUT | Job CRUD (public read) |
| `/api/applications` | GET, POST, PUT, DELETE | Application CRUD |
| `/api/medical-records` | GET, POST, PUT, DELETE | Medical records |
| `/api/auth/discord/oauth` | GET | Discord OAuth2 flow |
| `/api/auth/discord/callback` | GET | OAuth callback |
| `/api/admin-auth` | POST | Admin login |
| `/api/admin-profile` | GET | Get admin profile |

---

## Demo Credentials (Local Dev)

### Admin Users
| Role | Discord ID | Password |
|---|---|---|
| Super Admin | `admin#0001` | `admin123` |
| Admin | `staff#0002` | `staff123` |
| Doctor | `doctor#0003` | `doctor123` |

> **Note:** Admin users need to be added to Supabase `admin_users` table manually (see `installation.md` Step 2.5)

### Patient Login
- Click "Login" → "Patient Login" → "Login with Discord"
- Uses Discord OAuth (create app at `discord.com/developers`)

---

## Environment Variables

### Frontend (`.env.local`)
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
DISCORD_REDIRECT_URI=http://localhost:5174/api/auth/discord/callback
```

### Vercel (Dashboard → Settings → Environment Variables)
Same as above + set `DISCORD_REDIRECT_URI` to your Vercel URL:
```
https://your-app.vercel.app/api/auth/discord/callback
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - feel free to use this project for your own hospital management system.

---

## Support

- **Installation Guide**: [installation.md](frontend/installation.md)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Discord Developer Portal**: [discord.com/developers](https://discord.com/developers)

---

<p align="center">
  Built with ❤️ using React + Supabase + Vercel
</p>
