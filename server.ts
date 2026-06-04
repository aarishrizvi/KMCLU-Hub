import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { BracketMatch, BracketSetup, BracketState } from './src/types';
import { createDefaultOverlayState } from './src/lib/state';

export interface OverlayState {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  matchTitle: string;
  roundName: string;
  matchStatus: string;
  nextTeamA: string;
  nextTeamB: string;
  nextMatchTitle: string;
  winnerName: string;
  winnerTeam: string;
  winnerScore: number;
  bracketSetup: BracketSetup;
  bracketMatches: BracketMatch[];
  bracket: BracketState;
  showOverlay: boolean;
}

const DEFAULT_STATE: OverlayState = createDefaultOverlayState();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  // Keep state in memory
  let currentState: OverlayState = { ...DEFAULT_STATE };

  io.on('connection', (socket) => {
    // Log new connections for debugging
    console.log(`Socket connected: ${socket.id} (address: ${socket.handshake.address})`);

    // Send current state to newly connected client
    socket.emit('stateUpdate', currentState);

    // Whenever a client (Control Room) sends an update
    socket.on('updateState', (newState: Partial<OverlayState>) => {
      console.log(`updateState from ${socket.id}:`, newState);
      currentState = { ...currentState, ...newState };
      // Broadcast to all connected clients (Overlay & other Control Rooms)
      io.emit('stateUpdate', currentState);
    });
    
    // Explicit reset functionality
    socket.on('resetState', () => {
      console.log(`resetState requested by ${socket.id}`);
      currentState = { ...DEFAULT_STATE };
      io.emit('stateUpdate', currentState);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  // API endpoints mapping if needed later

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
