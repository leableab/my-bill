# My Bill - Personal Finance Tracker
## สรุปสถานะโปรเจค (อัปเดต: 3 เมษายน 2569)

---

## Tech Stack
| เทคโนโลยี | เวอร์ชัน | หมายเหตุ |
|-----------|---------|----------|
| Next.js | 16 (App Router) | Static export (`output: 'export'`) |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | v4 | CSS-based config (`@theme inline`) |
| shadcn/ui | Latest | 13 components ติดตั้งแล้ว |
| Supabase | JS Client v2 | Auth + PostgreSQL + RLS |
| Recharts | Latest | Donut chart, Bar chart |
| React Hook Form + Zod | Latest | Form validation ทุก form |
| date-fns | Latest | Thai locale สำหรับวันที่ |
| Capacitor | Latest | Config พร้อม, ยังไม่ build native |
| Lucide React | Latest | Icons ทั้งระบบ |
| Sonner | Latest | Toast notifications |

---

## สิ่งที่ทำเสร็จแล้ว

### 1. Authentication (Supabase Auth)
- [x] หน้า Login (Email + Password)
- [x] หน้า Register (ชื่อ + Email + Password + ยืนยันรหัสผ่าน)
- [x] Auth Provider (session management)
- [x] Auth Guard (redirect ถ้ายังไม่ login)
- [x] Auto-create profile เมื่อสมัครสมาชิก (DB trigger)
- [x] Neon purple glow effect บนหน้า login/register

### 2. Dashboard (หน้าหลัก)
- [x] แสดงยอดเงินคงเหลือ (Balance Card + glow)
- [x] รายรับ/รายจ่ายของเดือนนี้ (Summary Cards)
- [x] Donut Chart แสดง category breakdown (Recharts)
- [x] รายการล่าสุด 5 รายการ
- [x] คำทักทายตามเวลา (เช้า/บ่าย/เย็น)

### 3. Add Transaction (เพิ่มรายการ)
- [x] FAB button (+) ตรงกลาง bottom nav
- [x] Bottom Sheet สำหรับเพิ่มรายการ
- [x] สลับ รายจ่าย/รายรับ (toggle)
- [x] กรอกจำนวนเงิน (฿ prefix)
- [x] เลือก Category แบบ grid (icons)
- [x] เลือกวันที่
- [x] บันทึก (note) - ไม่บังคับ
- [x] Categories รายจ่าย: อาหาร, เดินทาง, บิล, ช้อปปิ้ง, สุขภาพ, บันเทิง, การศึกษา, อื่นๆ
- [x] Categories รายรับ: เงินเดือน, ฟรีแลนซ์, การลงทุน, รายได้อื่นๆ

### 4. Transaction List (รายการทั้งหมด)
- [x] Filter by เดือน (เลื่อนซ้าย/ขวา + แสดงปี พ.ศ.)
- [x] Filter by ประเภท (ทั้งหมด/รายรับ/รายจ่าย)
- [x] ค้นหาตาม note
- [x] สรุปรับ/จ่าย/คงเหลือ ของเดือนที่เลือก
- [x] จัดกลุ่มตามวันที่
- [x] Swipe to delete (touch gesture)
- [x] สีเขียวสำหรับรายรับ, สีแดงสำหรับรายจ่าย

### 5. Budget (งบประมาณ)
- [x] ตั้งงบประมาณรายเดือนแยกตาม category
- [x] Progress bar บอกว่าใช้ไปกี่ %
- [x] สี: เขียว (<80%), เหลือง (80-99%), แดง (>=100%)
- [x] Alert toast เมื่อใช้เกิน threshold
- [x] เพิ่ม/ลบ budget
- [x] Empty state สวยงาม

### 6. Reports (รายงาน)
- [x] สรุปรายเดือน: รายรับ/รายจ่าย/เงินออม (3 cards)
- [x] Bar Chart 6 เดือนย้อนหลัง (Recharts)
- [x] Category breakdown พร้อม progress bar
- [x] เลือกเดือนได้ (เลื่อนซ้าย/ขวา)
- [x] Export CSV (รองรับภาษาไทย + BOM)

### 7. Settings (ตั้งค่า)
- [x] แสดง/แก้ไขชื่อที่แสดง
- [x] แสดงสกุลเงิน (บาท ฿ - read only)
- [x] ปรับ budget alert threshold (50%-100% slider)
- [x] บันทึกการตั้งค่าลง Supabase
- [x] แสดงเวอร์ชันแอป
- [x] ปุ่มออกจากระบบ

### 8. Layout & Navigation
- [x] Dark mode only (ไม่มี light mode)
- [x] Mobile-first layout (max-width 430px, centered)
- [x] Bottom Navigation (5 tabs + FAB)
- [x] Settings gear icon ทุกหน้า (top-right)
- [x] ไม่มี sidebar

### 9. Database (Supabase)
- [x] 4 Tables: profiles, transactions, budgets, monthly_summaries
- [x] Row Level Security (RLS) ทุกตาราง
- [x] Indexes สำหรับ performance
- [x] Auto-create profile trigger
- [x] updated_at trigger

### 10. Supabase Edge Function
- [x] monthly-summary function (Deno)
- [x] pg_cron SQL template (commented, ready to activate)

### 11. Capacitor
- [x] capacitor.config.ts (webDir: 'out')
- [x] package.json scripts: cap:sync, cap:android, cap:ios
- [ ] ยังไม่ได้ add android/ios platforms

---

## สิ่งที่ยังไม่ได้ทำ / ทำได้ในอนาคต

### ยังไม่ทำ
- [ ] Deploy Edge Function ไป Supabase จริง (`npx supabase functions deploy`)
- [ ] เปิดใช้ pg_cron job (ต้อง enable extension + ใส่ service role key)
- [ ] Build Android/iOS ด้วย Capacitor (`npx cap add android`)
- [ ] Deploy web app (Vercel/Netlify/etc.)
- [ ] PWA manifest + service worker

### ปรับปรุงได้
- [ ] Supabase Realtime subscription (อัปเดตข้อมูลแบบ real-time)
- [ ] Category แก้ไข/เพิ่มเอง (ตอนนี้ fixed list)
- [ ] รองรับหลายสกุลเงิน
- [ ] Recurring transactions (รายการประจำ)
- [ ] Attach รูปภาพ/ใบเสร็จ
- [ ] Dark/Light mode toggle
- [ ] Data backup/restore
- [ ] Multi-device sync indicator

---

## โครงสร้างไฟล์

```
financetracker/
├── .env.local                          # Supabase credentials (ไม่ commit)
├── .env.local.example                  # Template
├── next.config.ts                      # Static export config
├── capacitor.config.ts                 # Capacitor config
├── components.json                     # shadcn/ui config
├── supabase/
│   ├── functions/monthly-summary/      # Edge Function (Deno)
│   └── migrations/                     # SQL migrations (2 files)
└── src/
    ├── app/
    │   ├── layout.tsx                  # Root: fonts, lang=th, Toaster
    │   ├── globals.css                 # Tailwind v4 + custom theme + glow utilities
    │   ├── page.tsx                    # Redirect → /dashboard
    │   ├── (auth)/                     # Login/Register (ไม่มี nav)
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   └── (app)/                      # Authenticated pages (มี nav)
    │       ├── layout.tsx              # Auth guard + mobile container + bottom nav + settings icon
    │       ├── dashboard/page.tsx
    │       ├── transactions/page.tsx
    │       ├── budget/page.tsx
    │       ├── reports/page.tsx
    │       └── settings/page.tsx
    ├── components/
    │   ├── ui/                         # shadcn/ui (13 components)
    │   ├── auth-guard.tsx
    │   ├── bottom-nav.tsx
    │   ├── add-transaction-sheet.tsx
    │   ├── dashboard/                  # balance-card, summary-cards, donut-chart, recent-transactions
    │   ├── transactions/               # filter-bar, transaction-item
    │   ├── budget/                     # budget-card, add-budget-dialog
    │   └── reports/                    # monthly-chart, summary-stats, csv-export
    ├── hooks/                          # use-transactions, use-dashboard, use-budgets, use-monthly-summary
    ├── lib/                            # supabase client, constants, format, schemas, utils
    ├── providers/                      # auth-provider
    └── types/                          # database.ts (Supabase types)
```

---

## เงื่อนไข / Design Rules สำคัญ

### 1. Static Export (สำคัญมาก)
- `output: 'export'` → ไม่มี SSR, API routes, middleware
- ทุก page ต้องเป็น `"use client"`
- Auth guard เป็น React component ไม่ใช่ middleware
- Supabase client ใช้ `@supabase/supabase-js` ตรงๆ (ไม่ใช่ `@supabase/ssr`)

### 2. Styling (สำคัญมาก)
- **ใช้ inline styles เท่านั้น** สำหรับ colors, bg, borders, padding, gap
- **ห้ามใช้** Tailwind custom classes (bg-bg-card, text-text-primary ฯลฯ) เพราะ shadcn override
- **ห้ามใช้** shadcn Button, Input, Card สำหรับ custom UI — ใช้ native HTML + inline styles
- shadcn components ใช้ได้เฉพาะ Sheet, Dialog, Tabs (container components)

### 3. Color Palette
| Token | ค่า | ใช้กับ |
|-------|-----|--------|
| Background | `#0a0a0f` | Page background |
| Card | `#131320` | Card backgrounds |
| Card border | `#2a2a4a` | Card borders (ต้องมีเสมอ!) |
| Input bg | `#1a1a2e` | Input fields, icon boxes |
| Input border | `#2a2a4a` | Input borders |
| Accent | `#a855f7` | Primary actions, active states |
| Accent dark | `#9333ea` | Gradient end |
| Text primary | `#f1f5f9` | หัวข้อ, ข้อความหลัก |
| Text secondary | `#94a3b8` | Labels, คำอธิบาย |
| Text muted | `#64748b` | Icons, ข้อความรอง |
| Success | `#22c55e` | รายรับ, สถานะดี |
| Danger | `#ef4444` | รายจ่าย, สถานะเกิน |
| Warning | `#f59e0b` | สถานะใกล้เกิน |

### 4. Component Specs
| Component | Spec |
|-----------|------|
| Card | bg #131320, border 1px solid #2a2a4a, radius 16px, padding 20px |
| Input | height 50px, padding 0 16px, radius 12px, bg #1a1a2e, border 1px solid #2a2a4a |
| Input focus | border-color #a855f7, box-shadow 0 0 15px rgba(168,85,247,0.2) |
| Button primary | gradient(135deg, #a855f7, #9333ea), height 50px, radius 12px, white text, glow |
| Button outline | bg transparent, border 1px solid #2a2a4a, height 44px |
| Section gap | 20px |
| Item gap | 10-12px |
| Label → Input gap | 8-10px |
| Input + Icon | Flex row: [icon box 44x44] [input] — icon อยู่ข้างนอก ไม่ใช่ข้างใน |

### 5. ภาษา
- UI ทั้งหมดเป็นภาษาไทย
- ฟอร์แมตเงิน: `฿1,234.56`
- วันที่: ใช้ date-fns + Thai locale
- ปีแสดงเป็น พ.ศ. (ปี + 543)

---

## Supabase Config
- **Project URL**: `https://tqxujtbpesgofgruqdyp.supabase.co`
- **Region**: Northeast Asia (Tokyo)
- **Plan**: Free (Nano)
- **Database**: PostgreSQL
- **Auth**: Email + Password (Confirm email ต้อง **ปิด** ใน Dashboard)

---

## GitHub
- **Repo**: `leableab/my-bill`
- **Branch**: `main`
- **Last commit**: feat: complete Personal Finance Tracker app
