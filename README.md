# KMCLU Hub

KMCLU Hub is a real-time broadcast graphics system built with React, Vite, Express, and Socket.IO. It provides a control room for editing match data and a live overlay view for OBS or other broadcast workflows.

## Features

- Real-time scoreboard updates over Socket.IO
- Separate Control Room and Overlay routes
- Editable team names, scores, match title, round, and status
- Overlay animations for live broadcast presentation
- Server-side state sync with reset support

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- Socket.IO
- Tailwind CSS v4
- Motion

## Getting Started

### Prerequisites

- Node.js

### Install

```bash
npm install
```

### Configure

Create a `.env.local` file if you need environment variables such as `GEMINI_API_KEY`.

```bash
GEMINI_API_KEY=your_key_here
```

### Run in development

```bash
npm run dev
```

The app starts the local server on `http://0.0.0.0:3000`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build the client and bundle the server
- `npm start` - run the production server from `dist/server.cjs`
- `npm run lint` - type-check the project
- `npm run clean` - remove build output

## Usage

1. Open the main app in your browser.
2. Open `/control-room` in one tab to edit match data.
3. Open `/overlay` in another tab or in OBS browser source.
4. Use the control room to update scores and toggle the overlay.

## Project Structure

- `src/App.tsx` - route entry point
- `src/pages/ControlRoom.tsx` - broadcast control interface
- `src/pages/Overlay.tsx` - live graphics overlay
- `src/lib/socket.ts` - Socket.IO client setup
- `server.ts` - Express and Socket.IO server

