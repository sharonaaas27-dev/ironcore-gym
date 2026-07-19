import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import { config } from './config';
import { setupSocket, getIO } from './socket';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    credentials: true,
  },
});

setupSocket(io);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err instanceof Error ? err.message : err);
});

mongoose
  .connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(config.port, () => {
      console.log(`Ash2 Fitness API running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export { io };
