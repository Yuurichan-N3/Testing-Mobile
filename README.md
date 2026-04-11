<div align="center">

<img width="100%" alt="header" src="https://capsule-render.vercel.app/api?type=waving&height=210&text=Yuurigram%20Mobile&fontAlign=50&fontAlignY=36&fontSize=56&desc=Telegram%20Automation%20%7C%20Mobile%20Frontend%20App&descAlign=50&descAlignY=58"/>

<img alt="typing" src="https://readme-typing-svg.demolab.com?font=Inter&size=18&duration=3000&pause=650&center=true&vCenter=true&width=900&lines=Mobile+UI+untuk+Yuurigram+Backend;Multi+Session+Telegram+Manager;Auto+Join+%2F+Leave+%2F+Referral+%2F+Reaction;Extract+InitData+%7C+Math+Solver+%7C+Giveaway+Hunter"/>

<p>
  <img alt="expo" src="https://img.shields.io/badge/Expo-React%20Native-000020?logo=expo&logoColor=white"/>
  <img alt="platform" src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-111111"/>
  <img alt="node" src="https://img.shields.io/badge/Node.js-Required-339933?logo=nodedotjs&logoColor=white"/>
  <img alt="backend" src="https://img.shields.io/badge/Backend-Required-EF4444"/>
  <img alt="author" src="https://img.shields.io/badge/制作-Yuurisandesu-111111"/>
</p>

<p>
  <b>Yuurigram Mobile</b> adalah aplikasi mobile berbasis React Native (Expo) sebagai frontend untuk <b>Yuurigram Backend</b>.<br/>
  Semua fitur otomasi Telegram dapat dijalankan langsung dari smartphone tanpa perlu buka terminal.<br/>
  Dibuat dan didistribusikan oleh <b>Yuurisandesu</b>.
</p>

</div>

---

## ⚙️ Requirements

- Node.js `18+`
- Expo CLI
- Yuurigram Backend yang sudah berjalan (wajib)
- Install dependencies:

```bash
npm install
```

---

## 🚀 Menjalankan App

### Development (Expo Go)

```bash
npx expo start
```

### Android

```bash
npx expo run:android
```

### iOS

```bash
npx expo run:ios
```

### Web

```bash
npx expo start --web
```

---

## 🔗 Konfigurasi Backend

Setelah app berjalan, buka tab **Settings** dan masukkan URL backend Yuurigram kamu:

```
http://IP_SERVER:PORT
```

Semua fitur akan terhubung ke backend tersebut secara otomatis.

---

## ✨ Fitur

### 📱 Session
- **Create Session** — Login akun Telegram dengan nomor HP, buat session baru
- **Account Status** — Cek status semua akun: nama, username, phone, premium status
- **Get Latest OTP** — Ambil kode OTP login terbaru dari Telegram

### 📊 Data
- **Extract InitData** — Extract `initData` Telegram Web App dari semua session dengan 3 mode output: raw query, user-first, atau keduanya

### 📢 Channels
- **Join Groups** — Auto join ke banyak group/channel sekaligus, dengan opsi mute dan archive otomatis setelah join
- **Leave Groups** — Auto leave dari group/channel di semua session
- **Giveaway Hunter** — Cari dan join channel giveaway secara otomatis dari feed sumber

### 🤖 Bot
- **Referral Bot** — Kirim `/start` dengan kode referral ke bot dari semua session
- **Auto Reaction** — Kirim reaction emoji ke pesan tertentu, mode satu emoji atau random dari pilihan
- **Math Quiz Solver** — Jawab soal matematika dari bot secara otomatis dengan 3 mode: click inline dulu, jawab dulu, atau langsung jawab
- **Click Inline** — Klik inline button di pesan terakhir dari bot secara otomatis
- **Auto Chat** — Kirim pesan otomatis ke bot: link X, Facebook, TikTok, Instagram, YouTube, username, custom text, atau crypto address

### 👤 Account
- **Edit Name** — Edit nama depan/belakang di semua akun dengan mode replace, append, atau delete
- **Chat Settings** — Mute/unmute semua chat, archive, atau block & delete pilihan
- **Set 2FA** — Aktifkan Two-Factor Authentication di semua akun sekaligus

---

## 🗂️ Struktur Proyek

```text
mobile/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── home.jsx         # Halaman utama — daftar fitur dengan filter kategori
│   │   │   ├── sessions.jsx     # Manajemen session Telegram
│   │   │   └── settings.jsx     # Konfigurasi URL backend
│   │   └── feature/
│   │       └── [id].jsx         # Halaman eksekusi tiap fitur (dynamic route)
│   ├── components/
│   │   ├── FeatureCard.jsx      # Card komponen tiap fitur di home
│   │   └── LogTerminal.jsx      # Terminal log output hasil eksekusi
│   ├── data/
│   │   └── features.js          # Definisi semua fitur, kategori, dan field input
│   └── utils/
│       ├── api.js               # API client — koneksi ke Yuurigram Backend
│       ├── settingsStore.js     # State management URL backend
│       └── auth/                # Auth flow (WebView, session store)
├── polyfills/                   # Polyfill web & native untuk library tertentu
├── app.json                     # Konfigurasi Expo
└── package.json
```

---

## 🧩 Arsitektur

```
Yuurigram Mobile (React Native / Expo)
  └─ src/utils/api.js
       └─ POST /api/telegram/proxy
            └─ Yuurigram Backend
                 └─ Telegram API (via session)
```

Semua request dari app dikirim ke backend melalui satu proxy endpoint. Backend yang menangani eksekusi ke Telegram — app hanya bertugas sebagai antarmuka.

---

## 📋 Kategori Fitur

| Kategori | Warna | Fitur |
|----------|-------|-------|
| Session | 🔵 Cyan | Create Session, Account Status, Get OTP |
| Data | 🟣 Ungu | Extract InitData |
| Channels | 🟢 Hijau | Join Groups, Leave Groups, Giveaway Hunter |
| Bot | 🔵 Biru | Referral, Reaction, Math Solver, Click Inline, Auto Chat |
| Account | 🩷 Pink | Edit Name, Chat Settings, Set 2FA |

---

## ⚠️ Disclaimer

Aplikasi ini dibuat untuk keperluan edukasi dan eksplorasi teknis. Gunakan dengan bijak dan tanggung jawab masing-masing.

---

<div align="center">
<img width="100%" alt="footer" src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer"/>
</div>
