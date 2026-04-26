
# Dehradoon Public Sr. Sec. School — Interactive SPA

A premium, single-page school website with smooth-scroll navigation, Framer Motion animations, and an admin panel powered by Firebase + Cloudinary.

---

## 🎨 Design system

- **Primary:** Green `#0B7A3B` (from logo)
- **Secondary:** Gold `#F4B400` (from logo wreath)
- **Accent surfaces:** Glassmorphism cards (frosted white over green/gold gradients), soft layered shadows
- **Typography:** Modern sans (Inter / Plus Jakarta Sans) with a display weight for hero & section titles
- **Motion language:** Subtle parallax in hero, scroll-triggered fade/slide-up reveals, staggered card grids, hover lift + glow micro-interactions, page-level smooth scroll (Lenis-style easing)
- All tokens defined in `index.css` + `tailwind.config.ts` as HSL variables — no hard-coded colors in components

## 🧱 Tech & libraries

- React + Vite + TypeScript + Tailwind (already in project)
- **framer-motion** for animations
- **react-intersection-observer** for scroll triggers
- **firebase** (Auth + Firestore) — you'll provide config via env vars
- **Cloudinary** unsigned upload widget — you'll provide cloud name + upload preset
- **react-hook-form + zod** for form validation
- **yet-another-react-lightbox** for gallery fullscreen viewer
- Context API for global app state (auth user, content cache)

## 🗂 Single-page sections (in scroll order)

1. **Sticky glass navbar** — logo + smooth-scroll links + "Admin" button
2. **Hero** — fullscreen, animated green→gold gradient mesh background, school logo, name, tagline *"Every Child is Unique in its Own Way"*, two CTAs (Explore ↓ / Contact). Floating decorative shapes with parallax.
3. **About** — scroll-revealed intro + 4-card stat row (Years, Students, Faculty, Awards) + mission/vision split layout
4. **Notices** — auto-scrolling marquee row + grid of latest notices (Firestore-backed, animated entrance)
5. **Events** — horizontal snap-scroll carousel of event cards, hover lifts, click opens animated modal with full details
6. **Staff** — flip cards (front: photo + name + role; back: bio + subjects), staggered grid reveal
7. **Gallery** — masonry grid with category filter chips (Independence Day, Janmashtami, Campus, etc.), click → fullscreen lightbox with swipe; Cloudinary-optimized delivery (`f_auto,q_auto,w_auto`)
8. **Toppers** — spotlight cards with animated rank badges, percentage counters that animate on scroll into view
9. **Key Dates** — vertical timeline with animated connector line drawing as you scroll
10. **Awards** — animated trophy/medal badge grid with shimmer effect on hover
11. **Contact** — split layout: contact form (name/email/phone/message, zod-validated) + info panel (school name, phone **8517577185**, address placeholder for Kanpur, map embed)
12. **Footer** — logo, quick links, socials, copyright
13. **Floating WhatsApp button** — bottom-right, pulse animation, opens `wa.me/918517577185`

## 🔐 Admin panel — `/admin`

- Public **/admin/login** route — Firebase Auth email+password
- Single hard-coded admin email (you'll provide) — gate enforced both client-side and via Firestore rules (`request.auth.token.email == 'your@email'`)
- **/admin/dashboard** — sidebar with sections: Notices, Events, Staff, Gallery, Toppers, Key Dates, Awards
- Each section: data table + Create / Edit / Delete with modal forms
- Media uploads use Cloudinary unsigned widget → store `{ secure_url, public_id }` in the matching Firestore doc
- Folder convention: `school/notices`, `school/events`, `school/gallery`, `school/staff`, `school/toppers`
- Toast feedback on every CRUD action; optimistic UI updates so the live site reflects changes instantly

## 📊 Firestore collections (schema)

- `notices` — title, body, date, pinned, attachmentUrl
- `events` — title, description, date, location, coverImage, gallery[]
- `staff` — name, role, subjects[], bio, photo, order
- `gallery` — title, category, type (image/video), url, publicId, createdAt
- `toppers` — name, class, year, percentage, photo, rank
- `keyDates` — title, date, description, type
- `awards` — title, year, description, image

## 🌱 Seed content (placeholder)

I'll seed realistic placeholder content using your uploads:
- Hero & gallery use the Independence Day / Janmashtami / Krishna costume / school building photos
- Logo placed in navbar, hero, footer, favicon
- 6 sample notices, 4 events, 6 staff cards, 12 gallery items (3 categories), 6 toppers, 8 key dates, 6 awards
- Stored as a local seed JSON used only when Firestore is empty (so the site looks alive before you connect Firebase)

## ⚡ Performance

- Lazy-load every section below the fold (`React.lazy` + Suspense)
- Lazy-load images with `loading="lazy"` + Cloudinary responsive `srcset`
- Animate only `transform` & `opacity`; respect `prefers-reduced-motion`
- Mobile-tuned: shorter durations, fewer parallax layers under 768px

## 🔒 Security & config

- Firebase + Cloudinary keys read from `.env` (`VITE_FIREBASE_*`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_ADMIN_EMAIL`)
- Form inputs validated with zod (length limits, email format, sanitized strings)
- No `dangerouslySetInnerHTML` anywhere
- Provided **Firestore rules** snippet (read: public; write: only admin email) for you to paste into Firebase console
- Provided **Cloudinary unsigned upload preset** instructions in README

## 📁 Folder structure

```
src/
  components/
    layout/        Navbar, Footer, WhatsAppFab, ScrollProgress
    sections/      Hero, About, Notices, Events, Staff, Gallery,
                   Toppers, KeyDates, Awards, Contact
    admin/         AdminLayout, DataTable, forms per collection
    ui/            (existing shadcn components)
  context/         AuthContext, ContentContext
  lib/             firebase.ts, cloudinary.ts, motion.ts (variants), seed.ts
  hooks/           useFirestoreCollection, useScrollReveal
  pages/           Index.tsx, AdminLogin.tsx, AdminDashboard.tsx, NotFound.tsx
  assets/          logo + uploaded photos
```

## 🧭 Routes

- `/` — full single-page site (smooth-scroll between sections via hash anchors)
- `/admin/login`
- `/admin/dashboard` (protected)
- `*` — NotFound

## ✅ What you'll need to provide after I build

1. **Firebase project config** (apiKey, authDomain, projectId, etc.) — I'll add as a secret/env
2. **Admin email** to seed in Firebase Auth + lock down rules
3. **Cloudinary cloud name** + **unsigned upload preset name**
4. Real address / email for Contact section (optional — placeholder used otherwise)

Until those are provided, the site runs in **demo mode** using local seed content so you can see and demo the full experience immediately.

## 📄 README

Step-by-step setup: creating the Firebase project, enabling Email/Password auth, pasting Firestore rules, creating the Cloudinary unsigned preset, and adding env vars in Lovable.
