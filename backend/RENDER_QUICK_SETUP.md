# Render Quick Setup Guide (Root Directory: backend)

## ✅ Render Service Settings

Since you've set **Root Directory** to `backend`, use these exact commands:

### Build Command:
```
npm install
```

### Start Command:
```
npm start
```

That's it! The `postinstall` script will automatically generate the Prisma client.

---

## 📋 Environment Variables

Add these in Render's Environment Variables section:

### Required:
```
PORT=4000
NODE_ENV=production
DATABASE_URL=[Get from Render PostgreSQL service]
REDIS_URL=[Get from Render Redis service]
JWT_SECRET=[Click "Generate" in Render]
JWT_EXPIRES=7d
FRONTEND_URL=https://your-frontend-app.onrender.com
DEMO_MODE=true
```

### Optional (for real Shopify):
```
CRON_SCHEDULE=0 * * * *
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_WEBHOOK_SECRET=
SHOPIFY_SCOPES=read_orders,read_products,read_customers
SHOPIFY_API_VERSION=2023-10
SHOPIFY_STORE_DOMAIN=
```

---

## 🔧 After First Deployment

Run database migrations via Render Shell:
```bash
npx prisma migrate deploy
```

---

## ✅ Verification

- ✅ Root Directory: `backend`
- ✅ Build Command: `npm install`
- ✅ Start Command: `npm start`
- ✅ All environment variables set
- ✅ Database and Redis services created

Your backend should now deploy successfully on Render!
