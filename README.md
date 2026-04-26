# Dehradoon Public Senior Secondary School — Kanpur

Modern single-page school website with smooth-scroll navigation, Framer Motion animations, Firebase + Cloudinary backend, and an admin panel.

## Stack
React + Vite + TypeScript • Tailwind • Framer Motion • Firebase (Auth + Firestore) • Cloudinary

## Demo mode
Out of the box the site runs with **seed content** so you can preview every section. Connect Firebase + Cloudinary to enable live data and the admin panel.

## Routes
- `/` — full single-page site
- `/admin/login` — Firebase email/password login
- `/admin/dashboard` — protected admin overview

## Environment variables (Lovable → Project Settings → Env)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=you@school.in
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## Firebase setup
1. Create a Firebase project → enable **Email/Password** auth.
2. Create the admin user with the email you set in `VITE_ADMIN_EMAIL`.
3. Create a Firestore database.
4. Paste these rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /{collection}/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "you@school.in";
    }
  }
}
```

## Cloudinary setup
1. Settings → Upload → add an **unsigned** preset.
2. Use folders `school/notices`, `school/events`, `school/gallery`, `school/staff`, `school/toppers`.

## Firestore collections
`notices`, `events`, `staff`, `gallery`, `toppers`, `keyDates`, `awards`

## Folder structure
```
src/
  assets/                logo + uploaded photos
  components/
    layout/              Navbar, Footer, WhatsAppFab, ScrollProgress
    sections/            Hero, About, Notices, Events, Staff, Gallery, Toppers, KeyDates, Awards, Contact
    SectionHeader.tsx
    ui/                  shadcn primitives
  context/               AuthContext, ContentContext
  hooks/
  lib/                   firebase, cloudinary, motion (variants), seed (placeholder data), utils
  pages/                 Index, AdminLogin, AdminDashboard, NotFound
```
