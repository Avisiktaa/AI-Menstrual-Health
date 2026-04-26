# Security Guide - API Keys & Environment Variables

## ⚠️ IMPORTANT: Never Commit API Keys to Git

All sensitive information is stored in `.env` files which are excluded from git via `.gitignore`.

---

## Setup Instructions

### 1. Backend Environment Variables

Copy the example file and add your actual keys:

```bash
cd server
copy .env.example .env
```

Then edit `server/.env` with your actual values:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=5000
NODE_ENV=development
```

### 2. Frontend Environment Variables

Copy the example file and add your actual Firebase config:

```bash
cd front
copy .env.example .env
```

Then edit `front/.env` with your actual Firebase values:

```env
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Current API Keys Location

### Backend (server/.env)
- ✅ Gemini API Key
- ✅ Port configuration

### Frontend (front/.env)
- ✅ Firebase API Key
- ✅ Firebase Auth Domain
- ✅ Firebase Project ID
- ✅ Firebase Storage Bucket
- ✅ Firebase Messaging Sender ID
- ✅ Firebase App ID

---

## What's Protected

The following files are in `.gitignore` and will NEVER be committed:

```
.env
.env.local
.env.production
.env.development
server/.env
front/.env
```

---

## What's Safe to Commit

These example files are safe and should be committed:

```
server/.env.example
front/.env.example
```

---

## For Deployment

When deploying to Render/Vercel/Netlify:

1. **DO NOT** copy .env files to the server
2. **DO** add environment variables through the platform's dashboard
3. **DO** use the platform's secrets management

### Render/Railway:
- Go to Environment Variables section
- Add each variable manually

### Vercel/Netlify:
- Go to Project Settings → Environment Variables
- Add each variable manually

---

## If You Accidentally Committed API Keys

If you accidentally committed API keys to git:

1. **Immediately revoke/regenerate the keys:**
   - Gemini: https://makersuite.google.com/app/apikey
   - Firebase: Firebase Console → Project Settings

2. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch server/.env front/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push (⚠️ dangerous):**
   ```bash
   git push origin --force --all
   ```

4. **Update .env files with new keys**

---

## Best Practices

✅ **DO:**
- Keep .env files local only
- Use .env.example for documentation
- Rotate keys regularly
- Use different keys for dev/prod
- Add .env to .gitignore

❌ **DON'T:**
- Commit .env files
- Share keys in chat/email
- Use production keys in development
- Hardcode keys in source code
- Push keys to public repositories

---

## Checking for Exposed Keys

Before pushing to GitHub:

```bash
# Check if .env is in git
git ls-files | findstr .env

# Should return nothing or only .env.example files
```

---

## Emergency Contact

If keys are exposed:
1. Revoke immediately
2. Generate new keys
3. Update deployment platforms
4. Monitor for unauthorized usage

---

## Key Rotation Schedule

- **Gemini API Key**: Every 90 days
- **Firebase Keys**: When team members leave
- **Production Keys**: After any security incident
