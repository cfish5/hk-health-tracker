# HK Health Tracker

Personal health & performance tracker — built for HK Holistic Coach clients.

## Features
- Daily diet log (6 meals, post-meal feelings, supplements with dose times, water, gratitude journal)
- Day rating slider 1–10 with descriptions
- Exercise log (weight training with 6 sets per exercise, auto-fill between sets, goal column, exercise library that remembers your history)
- Copy yesterday's session as draft
- Aerobic activity logging
- Daily evaluation (sleep, mood, appetite, energy)
- Body measurements (periodic — weight, stomach, waist, hips, thigh, chest, arm)
- Ailments tracker with "pain in the arse" percentage and history over time
- Progress charts (body, wellness, exercise, ailments trends)
- Share report with Hector via email (admin@holisticcoach.com.au)
- Full PWA — installs on iPhone/Android home screen, works offline

## Colour palette (HK Holistic Coach brand)
- Primary yellow: `#f8e71c`
- Dark background: `#1E1C27`
- Card surface: `#2a2830`

## Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Install and run locally
```bash
cd hk-health-tracker
npm install
npm run dev
```
Then open http://localhost:5173 in your browser.

### Build for deployment
```bash
npm run build
```
This creates a `dist/` folder ready to deploy.

## Deploy free in 2 minutes — Netlify Drop

1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page
4. Netlify gives you a live URL instantly
5. Open that URL on your phone
6. Tap the share button → "Add to Home Screen"

The app is now installed on your phone like a native app.

## Deploy free — Cloudflare Pages (recommended for permanent hosting)

1. Push the project to a GitHub repo
2. Go to https://pages.cloudflare.com
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Deploy — you get a free `*.pages.dev` URL

## Data storage
All data is stored locally on the device using `localStorage`. Nothing is sent anywhere except when you explicitly email Hector. Data persists across sessions as long as you don't clear browser/app data.

## Future enhancements
- iCloud/Google Drive backup
- Automated HTML report generation and email to Hector
- Push notification reminders
- Progress photos
