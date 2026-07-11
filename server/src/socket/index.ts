import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export const setupSocket = (serverIo: SocketIOServer) => {
  io = serverIo;
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call setupSocket first.');
  }
  return io;
};

export const sendNotification = (userId: string, notification: unknown) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};
