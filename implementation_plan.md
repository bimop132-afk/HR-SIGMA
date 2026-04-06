# 🏢 HR Employee Management Dashboard — Frontend Plan

## Gambaran Umum

Membangun dashboard HR terpusat untuk mengelola siklus hidup karyawan: **Onboarding → Maintenance → Offboarding**. Aplikasi ini akan menggantikan pencatatan spreadsheet manual dengan antarmuka modern, responsif, dan premium.

### Design Direction

![Dashboard Mockup Reference](C:\Users\USER\.gemini\antigravity\brain\8f489ed3-ac21-4369-acdc-f6e319aac15f\dashboard_mockup_1775109898723.png)

---

## User Review Required

> [!IMPORTANT]
> **Teknologi:** Plan ini menggunakan **vanilla HTML + CSS + JavaScript** (tanpa framework) agar ringan dan mudah di-maintain. Jika kamu ingin menggunakan React/Vue/Next.js, beritahu sebelum eksekusi.

> [!IMPORTANT]
> **Data Storage:** Untuk fase frontend ini, data akan disimpan di **localStorage** sebagai mock database. Nanti bisa di-upgrade ke backend API. Apakah ini acceptable?

> [!WARNING]
> **Scope:** Plan ini fokus 100% di frontend. Fitur seperti Auto-Notification email dan cloud storage untuk dokumen membutuhkan backend — akan dimark sebagai placeholder UI.

---

## 🎨 Design System

### Color Palette (Dark Mode First)

| Token | Hex | Penggunaan |
|:---|:---|:---|
| `--bg-primary` | `#0f1117` | Background utama (deep dark) |
| `--bg-secondary` | `#1a1d2e` | Card background, sidebar |
| `--bg-tertiary` | `#252838` | Input fields, hover states |
| `--glass` | `rgba(255,255,255,0.05)` | Glassmorphism panels |
| `--glass-border` | `rgba(255,255,255,0.08)` | Glass border subtle |
| `--accent-primary` | `#7c5cfc` | Primary actions, active states (Purple) |
| `--accent-secondary` | `#22d3ee` | Secondary highlights (Teal/Cyan) |
| `--accent-success` | `#34d399` | Status aktif, checklist done |
| `--accent-warning` | `#fbbf24` | Alerts, kontrak hampir habis |
| `--accent-danger` | `#f87171` | Resign, error states |
| `--text-primary` | `#e2e8f0` | Teks utama (off-white) |
| `--text-secondary` | `#94a3b8` | Teks sekunder (muted) |
| `--text-tertiary` | `#64748b` | Labels, placeholder |

### Typography

- **Font:** `Inter` (Google Fonts) — clean, modern, excellent readability
- **Heading H1:** 28px / 700 weight
- **Heading H2:** 22px / 600 weight
- **Body:** 14px / 400 weight
- **Caption/Label:** 12px / 500 weight (uppercase tracking)

### Glassmorphism Effect

```css
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Micro-Animations

| Element | Animasi | Duration |
|:---|:---|:---|
| Card hover | Scale 1.02 + glow shadow | 200ms ease |
| Sidebar item hover | Slide-in highlight bar | 150ms ease |
| Page transition | Fade-in + slide up | 300ms ease-out |
| KPI counter | Count-up number animation | 800ms ease-out |
| Button click | Ripple effect | 400ms |
| Notification bell | Subtle shake | 500ms |
| Modal open | Scale from 0.95 + fade | 250ms ease |

---

## 🧭 Navigation Architecture

### Sidebar Navigation (Persistent Left)

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────┐                                       │
│  │  🏢 LOGO │   HR Dashboard                       │
│  └──────────┘                                       │
│                                                     │
│  ── MAIN ──────────────────                         │
│  📊 Dashboard          ← Overview & KPIs            │
│  👥 Karyawan           ← Employee List + Directory  │
│                                                     │
│  ── MANAJEMEN ─────────                             │
│  ➕ Onboarding         ← Form Input Karyawan Baru   │
│  🚪 Offboarding       ← Resign & Clearance         │
│  📈 Analytics          ← Turnover Charts            │
│                                                     │
│  ── TOOLS ─────────────                             │
│  🔔 Reminders          ← Kontrak & Alerts          │
│  📁 Dokumen            ← Document Center            │
│  📥 Export             ← Download Report             │
│                                                     │
│  ── SYSTEM ────────────                             │
│  ⚙️ Pengaturan         ← RBAC & Preferences        │
│                                                     │
│  ┌─────────────────┐                                │
│  │ 👤 Admin HR      │  ← User profile mini          │
│  │    Online        │                               │
│  └─────────────────┘                                │
└─────────────────────────────────────────────────────┘
```

### Navigation Behavior

- **Desktop (>1024px):** Sidebar fixed, expanded (240px wide)
- **Tablet (768–1024px):** Sidebar collapsed (icon-only, 72px) — expand on hover
- **Mobile (<768px):** Hamburger menu → off-canvas drawer
- **Active state:** Left accent bar (4px `--accent-primary`) + bold text + subtle bg highlight
- **Collapsible:** Toggle button di bottom sidebar untuk collapse/expand manual

---

## 📄 Page Layouts & Components

### 1. 📊 Dashboard (Home)

**Tujuan:** Overview cepat — jawab pertanyaan bisnis dalam 5 detik.

```
┌─────────────────────────────────────────────────────────┐
│  Welcome back, Admin HR 👋          🔔 3  🌙/☀️        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Total   │ │ Masuk   │ │ Resign  │ │ Kontrak │      │
│  │ 247     │ │ +12     │ │ -3      │ │ ⚠️ 5    │      │
│  │ Aktif   │ │ Bulan   │ │ Bulan   │ │ Segera  │      │
│  │         │ │ Ini     │ │ Ini     │ │ Habis   │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│                                                         │
│  ┌───────────────────────────┐ ┌───────────────────┐    │
│  │  📈 Turnover Analytics    │ │  🏢 Departemen    │    │
│  │  Line chart: Masuk vs     │ │  Donut chart:     │    │
│  │  Keluar (6 bulan)         │ │  Distribusi       │    │
│  │                           │ │  karyawan         │    │
│  └───────────────────────────┘ └───────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  🕐 Aktivitas Terbaru                              │  │
│  │  • Budi Santoso — Onboarding selesai — 2 jam lalu │  │
│  │  • Siti Aminah — Resign submitted — Kemarin       │  │
│  │  • Rudi Hartono — Pindah ke Dept. Marketing       │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Komponen:**
- `KPICard` — Glass card dengan icon, angka besar (count-up animation), label, dan trend indicator (↑↓)
- `TurnoverChart` — Line chart (Canvas/Chart.js) perbandingan masuk vs keluar 6 bulan
- `DepartmentChart` — Donut chart distribusi per departemen
- `ActivityFeed` — Timeline list aktivitas terbaru dengan avatar, aksi, dan timestamp

---

### 2. 👥 Karyawan (Employee Directory)

**Tujuan:** Browse, search, dan filter semua karyawan.

```
┌─────────────────────────────────────────────────────────┐
│  Karyawan Aktif                     [🔍 Search...    ] │
│                                                         │
│  Filter: [Semua Dept ▾] [Semua Posisi ▾] [Status ▾]   │
│                                                         │
│  ┌───┬──────────────┬──────────┬────────┬────────┬───┐ │
│  │   │ Nama         │ NIK      │ Dept   │ Status │ ⋯ │ │
│  ├───┼──────────────┼──────────┼────────┼────────┼───┤ │
│  │ 📷│ Budi Santoso │ 317...   │ IT     │ 🟢     │ ⋮ │ │
│  │ 📷│ Siti Aminah  │ 321...   │ HR     │ 🟢     │ ⋮ │ │
│  │ 📷│ Rudi Hartono │ 352...   │ Mktg   │ 🟡     │ ⋮ │ │
│  └───┴──────────────┴──────────┴────────┴────────┴───┘ │
│                                                         │
│  Showing 1-10 of 247         [◀ 1 2 3 ... 25 ▶]       │
└─────────────────────────────────────────────────────────┘
```

**Komponen:**
- `SearchBar` — Real-time search dengan debounce
- `FilterDropdown` — Multi-select filter per departemen, posisi, status
- `EmployeeTable` — Sortable table dengan avatar, badge status
- `Pagination` — Navigasi halaman
- `EmployeeDetailModal` — Klik row → modal detail lengkap karyawan
- `ActionMenu` — Dropdown (⋮) untuk Edit, Lihat Detail, Offboard

---

### 3. ➕ Onboarding (Form Input Karyawan Baru)

**Tujuan:** Smart form multi-step untuk registrasi karyawan baru.

```
┌─────────────────────────────────────────────────────────┐
│  Onboarding Karyawan Baru                               │
│                                                         │
│  Step: [①─────②─────③─────④]                           │
│         Data    Dokumen  Notify  Review                 │
│         Diri                                            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  STEP 1: Data Pribadi                              │  │
│  │                                                     │  │
│  │  Nama Lengkap    [________________________]        │  │
│  │  NIK (16 digit)  [________________] ✅ Valid       │  │
│  │  Posisi           [__________ ▾]                    │  │
│  │  Departemen       [__________ ▾]                    │  │
│  │  Tanggal Masuk    [📅 ___________]                  │  │
│  │  Tipe Kontrak     (●) PKWT  (○) PKWTT              │  │
│  │  Durasi Kontrak   [__ bulan] (jika PKWT)           │  │
│  │                                                     │  │
│  │                    [← Kembali]  [Lanjut →]         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Multi-Step Flow:**
1. **Data Pribadi** — Nama, NIK (validasi 16 digit), Posisi, Departemen, Tanggal Masuk, Tipe Kontrak
2. **Upload Dokumen** — Drag & drop zone untuk KTP, NPWP, Kontrak (preview thumbnail)
3. **Notifikasi** — Preview checklist auto-notification ke IT & GA (UI placeholder)
4. **Review & Submit** — Summary semua data untuk konfirmasi final

**Komponen:**
- `StepProgress` — Progress indicator visual 4 langkah
- `SmartInput` — Input dengan validasi real-time + error message
- `DropZone` — Drag & drop file upload area dengan preview
- `ContractToggle` — Switch PKWT/PKWTT yang mengubah form fields
- `ReviewSummary` — Card ringkasan semua data sebelum submit

---

### 4. 🚪 Offboarding (Resign & Clearance)

**Tujuan:** Manage proses resign dengan digital clearance checklist.

```
┌─────────────────────────────────────────────────────────┐
│  Offboarding                        [+ Submit Resign]  │
│                                                         │
│  ┌─ Active Offboarding ────────────────────────────┐    │
│  │                                                   │    │
│  │  👤 Siti Aminah — IT Department                  │    │
│  │  Tanggal Resign: 15 April 2026                   │    │
│  │  Alasan: Personal                                 │    │
│  │                                                   │    │
│  │  ── Clearance Checklist ──                       │    │
│  │  [✅] Serah terima pekerjaan                      │    │
│  │  [✅] Kembalikan laptop                           │    │
│  │  [⬜] Kembalikan ID Card                          │    │
│  │  [⬜] Hapus akses email & sistem                  │    │
│  │  [⬜] Exit interview                              │    │
│  │                                                   │    │
│  │  Progress: ████████░░░░░ 40%                     │    │
│  │                                                   │    │
│  │  [Approve Final Resign ✓] (disabled until 100%) │    │
│  └───────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─ History Resigned ──────────────────────────────┐    │
│  │  Rudi Hartono   │ 01 Mar 2026 │ Completed ✓    │    │
│  │  Andi Pratama   │ 15 Feb 2026 │ Completed ✓    │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Komponen:**
- `ResignForm` — Modal input tanggal resign + alasan (dropdown + textarea)
- `ClearanceCard` — Card per karyawan dengan interactive checklist
- `ProgressBar` — Visual bar persentase clearance
- `ApproveButton` — Disabled state sampai 100%, glow animation saat ready
- `ResignHistory` — Table karyawan yang sudah selesai offboarding

---

### 5. 📈 Analytics (Turnover Dashboard)

**Tujuan:** Visualisasi data masuk/keluar untuk decision-making.

```
┌─────────────────────────────────────────────────────────┐
│  Turnover Analytics             Period: [2026 ▾] [Q1 ▾]│
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📊 Karyawan Masuk vs Keluar (Bar Chart)          │   │
│  │  ███ ██ █████ ████ ██████ ███                    │   │
│  │  Jan  Feb  Mar  Apr  May  Jun                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────┐  ┌────────────────────┐         │
│  │ Turnover Rate      │  │ Avg. Tenure        │         │
│  │     3.2%           │  │    2.4 tahun        │         │
│  │  ↓ 0.5% vs Q4     │  │  ↑ 0.3 vs Q4       │         │
│  └────────────────────┘  └────────────────────┘         │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Alasan Resign (Pie Chart)                        │   │
│  │  🔴 Personal 40%  🟡 Karir 30%  🔵 Lain 30%     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Komponen:**
- `PeriodFilter` — Dropdown tahun + quarter/bulan
- `BarChart` — Perbandingan masuk vs keluar per bulan
- `StatCard` — Turnover rate & average tenure dengan trend
- `PieChart` — Breakdown alasan resign
- Chart library: **Chart.js** (ringan, vanilla JS friendly)

---

### 6. 🔔 Reminders

**Tujuan:** Notifikasi kontrak PKWT yang akan segera habis.

**Komponen:**
- `ReminderList` — Cards dengan countdown (misal: "Kontrak habis dalam 14 hari")
- `ReminderBadge` — Badge warna: 🔴 <7 hari, 🟡 <30 hari, 🟢 >30 hari
- `NotificationBell` — Bell icon di header dengan unread count

---

### 7. 📁 Dokumen (Document Center)

**Tujuan:** Lihat dan kelola dokumen karyawan.

**Komponen:**
- `DocumentGrid` — Grid view file per karyawan
- `FilePreview` — Preview thumbnail (untuk frontend: placeholder preview)
- `UploadModal` — Upload file baru ke karyawan tertentu

---

### 8. 📥 Export Report

**Tujuan:** Download data ke format Excel/PDF.

**Komponen:**
- `ExportPanel` — Pilih range data, format (CSV/PDF), dan klik download
- `ReportTemplate` — Pre-built template: Daftar karyawan aktif, Laporan turnover bulanan

---

### 9. ⚙️ Pengaturan (Settings)

**Tujuan:** Konfigurasi RBAC dan preferensi aplikasi.

**Komponen:**
- `RoleManager` — Tabel roles (Admin HR, Manager, IT/GA) dengan permission toggles
- `ThemeToggle` — Dark/Light mode switch
- `DepartmentManager` — CRUD departemen dan posisi

---

## 🗂️ File Structure

```
project/
├── index.html              ← Entry point, SPA shell
├── css/
│   ├── variables.css       ← Design tokens (colors, spacing, fonts)
│   ├── base.css            ← Reset, typography, global styles
│   ├── layout.css          ← Sidebar, header, main content grid
│   ├── components.css      ← Reusable component styles
│   └── pages.css           ← Page-specific overrides
├── js/
│   ├── app.js              ← Router, init, global state
│   ├── router.js           ← Hash-based SPA router
│   ├── store.js            ← localStorage data management
│   ├── utils.js            ← Validation, formatting helpers
│   ├── components/
│   │   ├── sidebar.js      ← Sidebar navigation
│   │   ├── header.js       ← Top bar with search & notifications
│   │   ├── kpi-card.js     ← KPI stat cards
│   │   ├── charts.js       ← Chart.js wrapper functions
│   │   ├── table.js        ← Reusable sortable table
│   │   ├── modal.js        ← Modal system
│   │   ├── form.js         ← Smart form with validation
│   │   ├── dropzone.js     ← File upload drag & drop
│   │   └── toast.js        ← Toast notifications
│   └── pages/
│       ├── dashboard.js    ← Dashboard page
│       ├── employees.js    ← Employee directory
│       ├── onboarding.js   ← Onboarding multi-step form
│       ├── offboarding.js  ← Offboarding & clearance
│       ├── analytics.js    ← Turnover analytics
│       ├── reminders.js    ← Contract reminders
│       ├── documents.js    ← Document center
│       ├── export.js       ← Export report
│       └── settings.js     ← Settings & RBAC
├── assets/
│   └── icons/              ← SVG icons
└── lib/
    └── chart.min.js        ← Chart.js CDN fallback
```

---

## 🔧 Technical Approach

### SPA Routing
- **Hash-based router** (`#/dashboard`, `#/employees`, `#/onboarding`, etc.)
- Setiap navigasi me-render page content ke `<main id="app-content">` tanpa reload
- Smooth page transitions via CSS animation

### Data Layer (localStorage)
```javascript
// Data structure di localStorage
{
  employees: [
    {
      id: "EMP-001",
      name: "Budi Santoso",
      nik: "3171234567890123",
      position: "Frontend Developer",
      department: "IT",
      joinDate: "2024-03-15",
      contractType: "PKWT",        // PKWT atau PKWTT
      contractEnd: "2026-03-15",
      status: "active",            // active | resigned | onboarding
      documents: [],
      resignDate: null,
      resignReason: null,
      clearance: {
        handover: false,
        laptop: false,
        idCard: false,
        accessRevoke: false,
        exitInterview: false
      }
    }
  ],
  departments: ["IT", "HR", "Marketing", "Finance", "Operations"],
  positions: ["Developer", "Designer", "Manager", "Staff", "Director"],
  activityLog: [
    { type: "onboard", employeeId: "EMP-001", date: "...", message: "..." }
  ]
}
```

### Responsive Breakpoints
| Breakpoint | Target | Layout |
|:---|:---|:---|
| `> 1200px` | Desktop | Sidebar expanded + full grid |
| `768–1200px` | Tablet | Sidebar collapsed (icons) + 2-col grid |
| `< 768px` | Mobile | Hamburger drawer + single column stack |

### Accessibility
- Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels pada interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus visible states
- Color contrast minimum ratio 4.5:1

---

## 📦 External Dependencies

| Library | Versi | Fungsi | Delivery |
|:---|:---|:---|:---|
| **Inter** font | Latest | Typography | Google Fonts CDN |
| **Chart.js** | 4.x | Grafik/Charts | CDN |
| **Lucide Icons** | Latest | Icon set SVG | CDN |

> Hanya 3 dependency external — sangat ringan.

---

## Open Questions

> [!IMPORTANT]
> 1. **Bahasa UI:** Apakah interface menggunakan **Bahasa Indonesia** sepenuhnya, atau campuran Indonesia-English?

> [!IMPORTANT]
> 2. **Seed Data:** Apakah perlu saya siapkan **dummy data karyawan** (20–30 records) agar dashboard terlihat hidup saat demo?

> [!NOTE]
> 3. **Light Mode:** Saya fokus dark mode dulu. Apakah light mode toggle perlu dibangun di versi pertama, atau bisa ditambah nanti?

> [!NOTE]
> 4. **Export Format:** Untuk fitur export, lebih prioritas **CSV** (sederhana) atau **PDF** (lebih formal tapi lebih kompleks)?

---

## Verification Plan

### Automated Tests
- Buka setiap halaman via browser dan verifikasi semua komponen ter-render
- Test responsive layout di 3 breakpoint (desktop, tablet, mobile)
- Validasi form onboarding (NIK 16 digit, required fields)
- CRUD operations: Tambah karyawan → Lihat di tabel → Update → Offboard
- Chart rendering dengan dummy data

### Manual Verification
- Screenshot setiap halaman untuk review visual
- Test navigasi sidebar di semua device size
- Verifikasi animasi dan transitions berjalan smooth
- Cross-browser check (Chrome, Firefox, Edge)
