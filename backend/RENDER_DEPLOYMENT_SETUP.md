# Render Deployment Setup - Backend

## ✅ Package.json Configuration

The `package.json` has been updated with the correct scripts:

- **`"start"`**: `"node src/index.js"` - Production server (used by Render)
- **`"dev"`**: `"nodemon src/index.js"` - Local development only
- **`"postinstall"`**: `"prisma generate"` - Auto-generates Prisma client after npm install

## ✅ Entry Point Verification

- **Entry file**: `src/index.js` ✓
- **Main field**: `"main": "src/index.js"` ✓
- **Start command**: Uses `node` (not nodemon) ✓

## 🚀 Render Service Configuration

**Important:** If you set the **Root Directory** to `backend` in Render, use these commands:

### Build Command:
```bash
npm install
```
*The `postinstall` script will automatically run `prisma generate`*

**OR** (if you want to be explicit):
```bash
npm install && npx prisma generate
```

### Start Command:
```bash
npm start
```

**OR** (explicit):
```bash
node src/index.js
```

---

**Note:** If Root Directory is NOT set to `backend`, use:
- Build: `cd backend && npm install`
- Start: `cd backend && npm start`

## 📋 Prisma Setup

The Prisma client will be automatically generated via:
1. `postinstall` script runs `prisma generate` after `npm install`
2. Or explicitly in build command: `npx prisma generate`

**Important**: After first deployment, run database migrations:
```bash
cd backend && npx prisma migrate deploy
```

You can do this via Render's shell/SSH or add it to a one-time build step.

## ✅ Verification Checklist

- [x] `"start"` script uses `node` (not nodemon)
- [x] `"dev"` script uses `nodemon` (for local development)
- [x] Entry point is `src/index.js`
- [x] No build script (not needed for Node.js backend)
- [x] `postinstall` script generates Prisma client
- [x] nodemon is in `devDependencies` (not installed in production)

## 🔍 Troubleshooting

If Render still tries to use `npm run dev`:
1. Check Render service settings → Start Command
2. Ensure it's set to: `cd backend && npm start`
3. Or explicitly: `cd backend && node src/index.js`

If Prisma client errors occur:
1. Ensure `postinstall` script is in package.json
2. Or add `npx prisma generate` to build command
3. Verify Prisma schema path is correct: `src/prisma/schema.prisma`
