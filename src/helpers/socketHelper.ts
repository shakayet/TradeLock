import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));
    
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      logger.info(colors.green(`User joined room: ${roomId}`));
    });

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      logger.info(colors.yellow(`User left room: ${roomId}`));
    });

    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
