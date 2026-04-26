# Deployment Guide - AI Menstrual Health Tracker

## Prerequisites
- GitHub account
- Vercel account (https://vercel.com)
- Render account (https://render.com) OR Railway account (https://railway.app)

---

## Step 1: Push Code to GitHub

```bash
cd "c:\Users\avisi\OneDrive\Desktop\period tracker\AI-Menstrual-Health"
git add .
git commit -m "feat: Ready for deployment with all features"
git push origin main
```

---

## Step 2: Deploy Backend (Choose ONE option)

### Option A: Deploy on Render (Recommended)

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `femhealth-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `GEMINI_API_KEY` = `AIzaSyAXk1WjddCK1Ynp5WIONQk8CFJiMKrF78E`
   - `PORT` = `5000`
   - `NODE_ENV` = `production`

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://femhealth-backend.onrender.com`

### Option B: Deploy on Railway

1. Go to https://railway.app and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `node index.js`

5. Add Environment Variables (same as above)
6. Deploy and copy your backend URL

---

## Step 3: Deploy ML Service (Python)

### On Render:

1. Click "New +" → "Web Service"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `femhealth-ml-service`
   - **Root Directory**: `ml-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python predict.py`
   - **Instance Type**: Free

4. Deploy and copy ML service URL

---

## Step 4: Update Backend with ML Service URL

Update `server/routes/predict.js`:

```javascript
// Change this line:
const scriptPath = path.join(__dirname, "../../ml-service/predict.py");

// To use deployed ML service:
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "https://femhealth-ml-service.onrender.com";
```

Add `ML_SERVICE_URL` to backend environment variables on Render.

---

## Step 5: Deploy Frontend

### Option A: Deploy on Vercel (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `front`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - `VITE_FIREBASE_API_KEY` = (your Firebase API key)
   - `VITE_FIREBASE_AUTH_DOMAIN` = (your Firebase auth domain)
   - `VITE_FIREBASE_PROJECT_ID` = (your Firebase project ID)
   - `VITE_FIREBASE_STORAGE_BUCKET` = (your Firebase storage bucket)
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = (your Firebase messaging sender ID)
   - `VITE_FIREBASE_APP_ID` = (your Firebase app ID)

6. Update `front/vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://femhealth-backend.onrender.com/:path*"
       }
     ]
   }
   ```

7. Click "Deploy"
8. Your frontend will be live at: `https://your-project.vercel.app`

### Option B: Deploy on Netlify

1. Go to https://netlify.com and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   - **Base directory**: `front`
   - **Build command**: `npm run build`
   - **Publish directory**: `front/dist`

5. Add Environment Variables (same as Vercel)
6. Update `front/netlify.toml` with your backend URL
7. Deploy

---

## Step 6: Update API Endpoints in Frontend

Update `front/src/services/api.js` or wherever you make API calls:

```javascript
// Change from:
const API_URL = 'http://localhost:5000';

// To:
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000';
```

---

## Step 7: Test Deployment

1. Visit your frontend URL
2. Test login/register
3. Test cycle analysis
4. Test language switching
5. Test dark mode
6. Test history page
7. Test chatbot

---

## Troubleshooting

### Backend Issues:
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set
- Check CORS settings in `server/index.js`

### Frontend Issues:
- Check browser console for errors
- Verify API URL is correct in vercel.json
- Check Firebase configuration

### ML Service Issues:
- Verify requirements.txt has all dependencies
- Check Python version (should be 3.9+)
- Verify model.pkl file is included in deployment

---

## Environment Variables Summary

### Backend (Render/Railway):
```
GEMINI_API_KEY=AIzaSyAXk1WjddCK1Ynp5WIONQk8CFJiMKrF78E
PORT=5000
NODE_ENV=production
ML_SERVICE_URL=https://femhealth-ml-service.onrender.com
```

### Frontend (Vercel/Netlify):
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Post-Deployment

1. Update README.md with live URLs
2. Test all features on production
3. Monitor logs for errors
4. Set up custom domain (optional)

---

## Cost Estimate

- **Render Free Tier**: Backend + ML Service (Free, sleeps after 15 min inactivity)
- **Vercel Free Tier**: Frontend (Free, unlimited bandwidth)
- **Firebase Free Tier**: Auth + Firestore (Free up to limits)
- **Total**: $0/month for hobby projects

---

## Upgrade Options (If Needed)

- **Render**: $7/month for always-on backend
- **Vercel Pro**: $20/month for team features
- **Firebase Blaze**: Pay-as-you-go for higher limits

---

## Support

If deployment fails:
1. Check service logs
2. Verify all environment variables
3. Test locally first
4. Check GitHub repository is up to date
