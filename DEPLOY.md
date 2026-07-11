# آن لائن Deploy — Maktaba Jamaat e Islami Faisalabad

دو طریقے: **A) Vercel + Render** (مفت شروع) یا **B) VPS** (تصاویر کے ساتھ بہتر)

---

## پہلے تیاری

### 1. GitHub پر code بھیجیں

```powershell
cd "e:\مکتبہ\پبلیشرز\Islamic-Books-Website"
git init
git add .
git commit -m "Maktaba Jamaat e Islami website"
```

GitHub.com → New Repository → پھر:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/maktaba-jamaat.git
git branch -M main
git push -u origin main
```

**نوٹ:** `server/.env` push نہیں ہوگی (.gitignore میں ہے)۔

### 2. MongoDB Atlas

- **Network Access** → `0.0.0.0/0` allow کریں (cloud servers کے لیے)
- Connection string تیار رکھیں

---

## طریقہ A: Vercel (Website) + Render (API)

### Step 1 — Backend on Render

1. [render.com](https://render.com) → Sign up → **New +** → **Blueprint**
2. GitHub repo connect کریں → `render.yaml` خود load ہوگا
3. **Environment Variables** set کریں:

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Atlas connection string |
| `CLIENT_URL` | `https://YOUR-APP.vercel.app` |
| `ADMIN_PASSWORD` | مضبوط password |
| `JWT_SECRET` | لمبا random text |
| `ADMIN_USERNAME` | `admin` |

4. Deploy — URL ملے گا: `https://maktaba-jamaat-api.onrender.com`

5. Test: `https://maktaba-jamaat-api.onrender.com/api/health`

**تصاویر:** Render free پر images folder نہیں رہتا۔ Covers کے لیے **طریقہ B (VPS)** بہتر ہے، یا `product.image` (online URL) استعمال ہوگی۔

---

### Step 2 — Frontend on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → GitHub repo
2. Settings (**IMPORTANT**):

| Setting | Value |
|---------|--------|
| **Root Directory** | `client` |
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

**یا** repo root سے deploy کریں (root `vercel.json` خود settings set کرتا ہے) — Root Directory **خالی** رکھیں۔

3. **Environment Variables:**

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://maktaba-jamaat-api.onrender.com` |
| `VITE_IMAGE_BASE` | `https://maktaba-jamaat-api.onrender.com/images` |

4. Deploy → URL: `https://YOUR-APP.vercel.app`

5. Render میں `CLIENT_URL` update کریں Vercel URL سے → Redeploy API

---

### Step 3 — Admin Panel

`https://YOUR-APP.vercel.app/admin`

Login: `server/.env` والے username/password

---

## طریقہ B: VPS (سب کچھ + تصاویر) — تجویز

Hostinger VPS, DigitalOcean, یا کوئی Linux server۔

### 1. Server setup

```bash
# Node.js 20 install (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2
```

### 2. Files upload

پورا folder upload کریں:
- `Islamic-Books-Website/`
- `پبلیشرز/` folder (Excel + images) — مثلاً `/var/www/publishers`

WinSCP یا FileZilla استعمال کریں۔

### 3. Configure

```bash
cd /var/www/Islamic-Books-Website/server
nano .env
```

```
PORT=5000
MONGODB_URI=your-atlas-uri
CLIENT_URL=https://yourdomain.com
DATA_ROOT=/var/www/publishers
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
JWT_SECRET=your-secret
NODE_ENV=production
```

### 4. Build & run

```bash
cd /var/www/Islamic-Books-Website
npm run install:all
npm run seed          # پہلی بار
npm run production    # build + start
```

یا PM2:

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 5. Domain + Nginx (optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

SSL: `sudo certbot --nginx -d yourdomain.com`

---

## Local production test

```powershell
cd "e:\مکتبہ\پبلیشرز\Islamic-Books-Website"
npm run production
```

Browser: **http://localhost:5000** (API + website ایک ساتھ)

---

## Commands خلاصہ

| Command | کام |
|---------|-----|
| `npm run dev` | Local development |
| `npm run build` | Frontend build |
| `npm run production` | Build + production server |
| `npm run seed` | Excel → MongoDB import |

---

## مسائل

| مسئلہ | حل |
|--------|-----|
| CORS error | `CLIENT_URL` میں Vercel URL درست لکھیں |
| Images نہیں | VPS + `DATA_ROOT` set کریں |
| API slow (Render free) | 30 sec cold start — VPS بہتر |
| Admin login fail | `ADMIN_PASSWORD` + `JWT_SECRET` check |

---

**WhatsApp:** 0321-5315603  
**Address:** دفتر جماعت اسلامی، گلی نمبر 8، چنیوٹ بازار، فیصل آباد
