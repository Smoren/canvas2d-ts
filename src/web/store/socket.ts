import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from '@/web/config';

export const useSocketStore = defineStore("socket", () => {
  let socket: Socket | undefined;

  const init = () => {
    socket = io(SOCKET_URL, { reconnectionDelayMax: 10000 });

    socket.on('connect', () => {
      console.log('socket connected');
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });

    socket.on('message', (data) => {
      console.log('socket message', data);
    });
  }

  const getSocket = (): Socket => {
    if (socket === undefined) {
      throw new Error('Socket not initialized');
    }

    return socket!;
  }

  return {
    init,
    getSocket,
  }
});
