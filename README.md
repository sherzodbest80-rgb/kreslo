# Damber — Premium Massaj Kreslolari

Lid olish uchun mo'ljallangan landing sayt. Next.js 15 (App Router) + Tailwind CSS + TypeScript.

## Texnologiyalar

- **Next.js 15** — App Router, Server Components
- **React 19**
- **Tailwind CSS 3.4**
- **TypeScript**
- **n8n integratsiya** — formalar avtomatik n8n webhook'ga yuboriladi

## Loyihani ishga tushirish

### 1. Bog'liqliklarni o'rnatish

```bash
npm install
```

### 2. Environment o'zgaruvchilarini sozlash

`.env.example` faylini `.env.local` ga nusxalang:

```bash
cp .env.example .env.local
```

Va `.env.local` ichidagi `N8N_WEBHOOK_URL` ni o'zingizning n8n webhook URL bilan to'ldiring.

### 3. Dev serverni ishga tushirish

```bash
npm run dev
```

Sayt http://localhost:3000 da ochiladi.

### 4. Production build

```bash
npm run build
npm start
```

## n8n bilan integratsiya

Formaga kelgan har bir lid `/api/lead` endpoint'iga yuboriladi, u esa o'z navbatida n8n webhook'ga uzatadi.

### n8n da workflow yaratish:

1. **Webhook node** — POST so'rovni qabul qiladi
2. Quyidagi ma'lumotlar keladi:
   ```json
   {
     "name": "Akmal",
     "phone": "+998901234567",
     "product": "3D Zero Gravity",
     "source": "damber.uz",
     "timestamp": "2026-05-07T10:30:00.000Z"
   }
   ```
3. Keyingi nodelar — masalan:
   - **Telegram** — sizga xabar yuborish
   - **Google Sheets** — ma'lumotni saqlash
   - **Email** — mijozga avtomatik javob

## Loyiha tuzilishi

```
damber-site/
├── app/
│   ├── api/
│   │   └── lead/
│   │       └── route.ts          # Lid API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Asosiy sahifa
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Products.tsx
│   ├── LeadForm.tsx              # Lid forma + n8n
│   └── Footer.tsx
├── lib/
│   └── data.ts                   # Mahsulotlar va sayt ma'lumotlari
├── public/
│   ├── logo.png
│   └── products/
│       ├── model-1.jpg
│       └── model-2.jpg
└── package.json
```

## Mahsulotlarni o'zgartirish

`lib/data.ts` faylini tahrirlang. Yangi mahsulot qo'shish, narxni o'zgartirish, xususiyatlarni qo'shish — hammasi shu yerda.

## Vercel ga deploy qilish

1. GitHub'ga push qiling
2. https://vercel.com da yangi loyiha yarating
3. GitHub repo'ni ulang
4. **Environment Variables** bo'limida `N8N_WEBHOOK_URL` ni qo'shing
5. Deploy tugmasini bosing — 2 daqiqada sayt tayyor

## Domen ulash

Vercel'da Settings → Domains bo'limidan `damber.uz` domenini qo'shing va DNS sozlamalarini kiritib chiqing.
# kreslo
