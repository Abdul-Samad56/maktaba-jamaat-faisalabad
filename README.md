# Maktaba Jamaat e Islami

Islamic books catalog built with **React**, **Node.js**, and **MongoDB Atlas**.
All product data and cover images come from the Excel files and image folders in the parent `پبلیشرز` directory.

## Project structure

```
Islamic-Books-Website/
├── client/          React (Vite) frontend
├── server/          Express API + MongoDB
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (free tier works)

## Setup

### 1. MongoDB Atlas

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user and allow your IP in Network Access
3. Copy the connection string

### 2. Backend

```bash
cd server
npm install
copy .env.example .env
```

Edit `server/.env`:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/islamic-books?retryWrites=true&w=majority
PORT=5000
CLIENT_URL=http://localhost:5173
```

Import all Excel records into MongoDB:

```bash
npm run seed
```

Start API:

```bash
npm run dev
```

API: `http://localhost:5000`  
Images: `http://localhost:5000/images/{folder}/{filename}.jpg`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Open: `http://localhost:5173`

## Data sources

Products are imported from these Excel files in `e:\مکتبہ\پبلیشرز\`:

- Maktaba Islamia Website.xlsx
- Darussalam Website.xlsx
- TajQuran Website.xlsx
- NBF Website.xlsx
- Manshurat Website.xlsx
- IMTBooks Website.xlsx
- Idara Publications Website.xlsx
- Islamic Publications Website.xlsx

Cover images are matched from folders with the same names.

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (pagination, filters, search) |
| GET | `/api/products/filters` | Authors, publishers, sources, languages |
| GET | `/api/products/:id` | Single product |

## Production build

```bash
cd client && npm run build
cd ../server && npm start
```

Serve the `client/dist` folder with any static host, or add Express static middleware for production.
