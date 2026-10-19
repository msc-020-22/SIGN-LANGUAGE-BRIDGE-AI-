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

## 3. Email/Password Authentication
Create a Supabase project and enable the Email provider under Authentication. Set the project's Site URL and allowed redirect URLs to the public origin of your deployed app. Set these variables in your local `.env` file for development and in your hosting provider's dashboard for production:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=https://your-deployed-app.example
```

`VITE_APP_URL` is the URL that confirmation and password-recovery emails open. It must be reachable from the device opening the email and must be included in Supabase's allowed redirect URLs. If it is omitted, the app uses the current browser origin. For local development, `localhost` works only when the email is opened on the same computer; use a public preview/deployment URL when confirming from another device. If email confirmations are enabled, users must confirm their address before signing in.

## 4. HTTPS & Camera Permissions
Browsers require a secure context (`https://` or `localhost`) to access webcam video streams (`navigator.mediaDevices.getUserMedia`). Ensure your production domain has an SSL/TLS certificate configured.
