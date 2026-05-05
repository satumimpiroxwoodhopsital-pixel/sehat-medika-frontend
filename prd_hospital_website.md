# Product Requirements Document (PRD)
## Hospital Website - Full Stack (Frontend + Backend CMS)

---

## 1. Overview

A full-stack hospital management platform consisting of:
- **Public Frontend**: Patient-facing website with appointment booking and job vacancy features
- **Backend CMS**: Full content management system with CRUD operations for all entities
- **Role-Based Access Control (RBAC)**: Granular permission system for admin and staff users

The system serves patients, job seekers, and hospital staff (doctors, HR, receptionists, admins) with appropriate access levels.

---

## 2. Target Users

| User Type | Access Level | Goals |
|-----------|--------------|-------|
| **Patients / Visitors** | Public | Book appointments, view doctors, check services, apply for jobs |
| **Job Seekers** | Public | Browse job openings, submit applications |
| **Doctors** | Staff (Limited CMS) | View their appointments, update their profile |
| **Receptionists** | Staff (CMS) | Manage appointments, view patient details, manage doctor schedules |
| **HR Staff** | Staff (CMS) | Manage job postings, review applications, manage career page content |
| **Content Managers** | Staff (CMS) | Manage website content (services, about page, doctors directory) |
| **Super Admin** | Staff (Full CMS) | Full system access, manage roles/permissions, all CRUD operations |

---

## 3. Site Structure & Pages

### 3.1 Public Frontend (All Users)
- **Home** (`/`) - Hero section, highlights, quick links
- **About Us** (`/about`) - Hospital profile, mission, vision, stats (CMS-managed)
- **Services** (`/services`) - Medical services offered (CMS-managed)
- **Doctors** (`/doctors`) - Doctor directory with specialization filter (CMS-managed)
- **Appointment Landing** (`/appointment`) - Info about booking process
- **Book Appointment** (`/appointment/book`) - Multi-step booking form
- **Booking Confirmation** (`/appointment/confirmation`) - Success page with reference
- **Careers Landing** (`/careers`) - Why work here, culture, benefits (CMS-managed)
- **Job Listings** (`/careers/jobs`) - Filterable job list
- **Job Detail** (`/careers/jobs/:id`) - Full job description (CMS-managed)
- **Job Application** (`/careers/jobs/:id/apply`) - Application form
- **Application Confirmation** (`/careers/jobs/confirmation`) - Success page
- **Contact** (`/contact`) - Map, address, phone (CMS-managed)
- **404** (`/404`) - Not found page

### 3.2 Admin Dashboard (Authenticated Staff/Admin)
- **Dashboard Home** (`/admin`) - Analytics overview, quick stats
- **CMS Management**:
  - **Services** (`/admin/cms/services`) - CRUD services
  - **Doctors** (`/admin/cms/doctors`) - CRUD doctors, manage schedules
  - **Pages** (`/admin/cms/pages`) - Edit static page content (about, contact, careers)
- **Appointment Management** (`/admin/appointments`) - View, filter, update status
- **Job Management** (`/admin/jobs`) - CRUD job postings, view applications
- **User Management** (`/admin/users`) - Manage staff accounts (Super Admin only)
- **Role & Permission Management** (`/admin/roles`) - CRUD roles, assign permissions (Super Admin only)
- **Settings** (`/admin/settings`) - System configuration

---

## 4. Functional Requirements

### 4.1 Public Frontend (Original Requirements)
| ID | Requirement | Priority |
|----|-------------|----------|
| A1 | User can select a department/service category | Must |
| A2 | User can optionally select a specific doctor | Nice-to-have |
| A3 | System displays available time slots for selected date | Must |
| A4 | User fills in personal details (name, phone, email) | Must |
| A5 | Form validation with clear error messages | Must |
| A6 | Booking confirmation page with reference number | Must |
| A7 | Responsive design works on mobile and desktop | Must |
| A8 | Date picker prevents booking past dates | Must |
| J1 | List all open positions with pagination | Must |
| J2 | Filter jobs by department, type, location | Must |
| J3 | Search jobs by keyword | Nice-to-have |
| J4 | Each job has detail page with full description | Must |
| J5 | Application form with CV upload field | Must |
| J6 | Form validation with clear error messages | Must |
| J7 | Application confirmation page | Must |
| J8 | Responsive design works on mobile and desktop | Must |
| N1 | Top navigation bar with logo, menu links, CTA buttons | Must |
| N2 | Mobile hamburger menu for small screens | Must |
| N3 | Footer with quick links, contact info, social media | Must |

### 4.2 Backend CMS - CRUD Operations
| ID | Entity | Operations | Priority |
|----|--------|------------|----------|
| C1 | **Services** | Create, Read, Update, Delete, Toggle publish status | Must |
| C2 | **Doctors** | Create, Read, Update, Delete, Manage schedules, Assign services | Must |
| C3 | **Appointments** | Read, Update status (pending/confirmed/cancelled/completed), Filter by date/doctor/status | Must |
| C4 | **Job Listings** | Create, Read, Update, Delete, Toggle publish status, Close job | Must |
| C5 | **Job Applications** | Read, Update status (new/reviewed/interviewed/rejected/hired), Download CV | Must |
| C6 | **Static Pages** | Update content for about, contact, careers, home hero sections | Must |
| C7 | **Users (Staff)** | Create, Read, Update, Delete, Activate/Deactivate (Super Admin only) | Must |
| C8 | **Roles** | Create, Read, Update, Delete, Assign permissions (Super Admin only) | Must |

### 4.3 Role-Based Access Control (RBAC)
| ID | Requirement | Priority |
|----|-------------|----------|
| R1 | System supports predefined roles: Super Admin, Admin, Doctor, Receptionist, HR, Content Manager | Must |
| R2 | Super Admin can create/edit/delete custom roles | Must |
| R3 | Each role has granular permissions per entity (create, read, update, delete, publish) | Must |
| R4 | Authentication via JWT with refresh tokens for admin/staff | Must |
| R5 | Protected routes: Unauthorized users redirected to login | Must |
| R6 | Session management: Auto-logout on token expiry | Must |
| R7 | Audit trail: Log all CMS actions with user ID, action, timestamp | Nice-to-have |

#### Access Matrix
| Feature | Super Admin | Admin | Doctor | Receptionist | HR | Content Manager |
|---------|-------------|-------|--------|--------------|----|-----------------|
| Manage Roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Staff Users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Services | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage Doctors | ✅ | ✅ | ✅ (self only) | ❌ | ❌ | ❌ |
| Manage Appointments | ✅ | ✅ | ✅ (own only) | ✅ | ❌ | ❌ |
| Manage Job Listings | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage Job Applications | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Manage Static Pages | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| View Analytics | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |

---

## 5. Database Entities & Schema

### Core Entities
| Entity | Key Fields | Relationships |
|--------|------------|---------------|
| **User (Staff)** | id, name, email, password (hashed), role_id, is_active, last_login | Belongs to Role |
| **Role** | id, name, description, permissions (JSON) | Has many Users |
| **Service** | id, name, description, icon, is_published, created_at | Has many Doctors |
| **Doctor** | id, name, photo, specialization, service_id, experience, rating, schedule (JSON) | Belongs to Service |
| **Appointment** | id, ref_number, patient_name, phone, email, service_id, doctor_id, date, time_slot, status, notes | Belongs to Service, Doctor |
| **Job** | id, title, department, type, location, description, requirements, is_published, is_closed, posted_date | Has many Applications |
| **JobApplication** | id, job_id, applicant_name, email, phone, cv_path, cover_letter, status, applied_at | Belongs to Job |
| **PageContent** | id, page_slug, section, title, content, media (JSON), updated_at | - |

---

## 6. Tech Stack

### Frontend (Public + Admin Dashboard)
| Layer | Technology |
|-------|------------|
| Framework | React (Vite) |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| State Management | React Query (TanStack Query) + Zustand |
| Forms | React Hook Form + Zod validation |
| UI Components | Shadcn/ui (for admin dashboard) |
| Icons | Lucide React |
| HTTP Client | Axios |

### Backend (CMS + API)
| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js (or NestJS for structured modules) |
| Language | TypeScript |
| Database | PostgreSQL (relational data) |
| ORM | Prisma |
| Authentication | JWT (jsonwebtoken) + bcrypt for password hashing |
| File Upload | Multer (for CV/resume uploads) |
| CMS | Custom CMS module (or Strapi headless CMS if preferred) |
| API Docs | Swagger/OpenAPI |

### DevOps & Tools
| Layer | Technology |
|-------|------------|
| Package Manager | npm/yarn |
| Linting | ESLint + Prettier |
| Environment | dotenv |

---

## 7. Design Guidelines

### 7.1 Public Frontend
- **Theme**: Clean, professional, trustworthy medical aesthetic
- **Primary Color**: Blue (#1a73e8) - trust and health
- **Secondary Color**: Teal (#00897b) - healing and calm
- **Accent Color**: Orange (#ff7043) - CTAs
- **Background**: Light gray (#f8f9fa) for sections, white for cards
- **Typography**: Sans-serif (Inter, Segoe UI, Roboto)
- **Border Radius**: 8px for cards and buttons

### 7.2 Admin Dashboard
- **Theme**: Clean, functional, dark/light mode toggle
- **Layout**: Sidebar navigation, top header with user profile, breadcrumbs
- **Primary Color**: Blue (#1a73e8)
- **Cards**: White cards with subtle shadows for data tables and stats
- **Tables**: Sortable, filterable, paginated data tables
- **Forms**: Consistent with frontend but with admin-specific fields
- **Typography**: Inter (via Google Fonts)

---

## 8. Non-Functional Requirements

### 8.1 Frontend
| Category | Requirement |
|----------|-------------|
| Performance | Lighthouse score > 85 (public), > 80 (admin) |
| Responsive | Mobile-first design, breakpoints at 640px, 768px, 1024px |
| Accessibility | Semantic HTML, alt tags, keyboard navigation (WCAG 2.1 AA) |
| Browser Support | Chrome, Firefox, Edge (latest 2 versions) |
| SEO | Basic meta tags, semantic headings, sitemap |

### 8.2 Backend
| Category | Requirement |
|----------|-------------|
| Security | Password hashing (bcrypt), JWT expiration, CORS configuration, SQL injection protection via Prisma |
| Performance | API response time < 200ms for CRUD operations |
| Scalability | Database indexing on frequently queried fields (email, ref_number, status) |
| Reliability | Input validation on all API endpoints (Zod) |
| Audit | All CMS actions logged with user ID and timestamp (nice-to-have) |

---

## 9. Out of Scope (Future Enhancements)
- Patient login portal (beyond public booking)
- Online payment for appointments/services
- Telemedicine/video consultations
- Multi-language support
- Email/SMS notifications (confirmation emails, appointment reminders)
- Mobile app (native)
- Integration with third-party EMR (Electronic Medical Records) systems

---

## 10. Success Criteria

### Frontend
- [ ] All public must-have features implemented and working
- [ ] Appointment booking flow completes end-to-end
- [ ] Job application form submits and shows confirmation
- [ ] Responsive on mobile (375px) and desktop (1920px)
- [ ] Clean, professional medical aesthetic
- [ ] No console errors or broken links

### Backend CMS
- [ ] All CRUD operations working for all entities
- [ ] Role-based access control enforced (correct permissions per role)
- [ ] Admin dashboard accessible only to authenticated staff
- [ ] JWT authentication with refresh token flow
- [ ] File upload (CV) working with proper storage
- [ ] Public frontend fetches data from backend API (no mock data)
- [ ] Audit logs for CMS actions (if implemented)

---

*Last updated: 2026-05-05*
*Version: 2.0 (Added Backend CMS, CRUD, RBAC)*
