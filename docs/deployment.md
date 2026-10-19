# Deployment Guide: Sign Language Bridge AI (SLB AI)

## 1. Hosting Options
SLB AI is a static React Single Page Application (SPA) with client-side TensorFlow.js inference. It can be deployed to:
- Google Cloud Run (Containerized via Node/Vite)
- Vercel / Netlify / Cloudflare Pages / GitHub Pages
- Docker / Static Nginx web server

## 2. Production Build Command
```bash
npm run build
```
This compiles the TypeScript code, bundles all React components, and copies the public TensorFlow.js model weights (`public/models/`) into `dist/`.

## 3. Environment Configuration
Set the following environment variables in your hosting provider's dashboard:
```env
# Optional Supabase Integration (falls back to local offline mode if omitted)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. HTTPS & Camera Permissions
Browsers require a secure context (`https://` or `localhost`) to access webcam video streams (`navigator.mediaDevices.getUserMedia`). Ensure your production domain has an SSL/TLS certificate configured.
