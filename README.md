# Face Recognition Attendance System — Vercel Ready

React + Vite frontend with Express API routes adapted for Vercel serverless functions.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `GEMINI_API_KEY` in Vercel Environment Variables if Gemini verification is required.
7. Deploy.

## Local development

```bash
npm install
npm run dev
```

The local development server runs on `http://localhost:3000`.

## Important persistence note

The original app used a local JSON file as its database. Vercel serverless functions do **not** provide durable writable local storage. The API has therefore been made serverless-compatible, but data written to the local JSON file should be treated as demo/temporary data. For production persistence, connect the API to a database such as Vercel Postgres, Neon, Supabase, or MongoDB.
