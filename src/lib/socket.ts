import { io, Socket } from 'socket.io-client';

// Connect to the local server, since we are serving the app from the same origin 
// in both dev and prod, we can usually just let it auto-connect to current host.
export const socket: Socket = io();
