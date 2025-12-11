<div align="center">
  <img height="90" src="https://raw.githubusercontent.com/Benjaminnnnnn/cliphop/main/src/utils/cliphop-logo-only.png" alt="Cliphop logo"/>
  <p><strong>Cliphop</strong> — a short‑form video playground with creator profiles, follows, likes, messaging, and uploads.</p>
  <p>
    <a href="https://cliphop.vercel.app/"><img height="20" src="https://img.shields.io/badge/live-demo-black?style=flat&logo=vercel&logoColor=white" /></a>
  </p>
</div>

## What’s inside

- Immersive video feed with hover controls, likes, comments, and shareable detail pages.
- Profiles with follow/following, posted/liked tabs, and messaging entry.
- Auth via Google OAuth.
- Upload flow with sanity-backed media storage and topics.
- Messaging: conversations list, real-time seeking controls on videos, and chat UI.

## Tech stack

- Next.js (React 18), TypeScript
- TailwindCSS for styling
- Sanity for content storage
- axios for client/server requests

## Run locally

1. Install deps

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Create a `.env` with your local API base URL (example):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_SANITY_TOKEN=...
```

## Key flows

- **Watch**: Browse the feed, hover to play/pause/mute, scrub with the timeline, fullscreen on click.
- **Engage**: Like, comment, and open detail pages for deeper context.
- **Follow**: Follow creators from their profile headers; follower/following counts update live.
- **Message**: Start a conversation from a profile or the messages page; delete threads you don’t need.
- **Upload**: Drop a video, add a caption/topic, and publish.

## Deploy

Deployed on Vercel. Ensure Sanity dataset + env vars are configured before shipping.
