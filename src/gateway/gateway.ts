import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway(4000, {
  cors: {
    origin: '*',
  },
})
export class Gateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('event_change_room')
  async handleJoinRoom(client: Socket, payload: any) {
    console.log(
      '🚀 ~ file: gateway.ts:21 ~ Gateway ~ handleJoinRoom ~ payload:',
      payload,
    );
    const theSocketId = client.id; // Salir de todas las salas
    this.server.in(theSocketId).socketsLeave(`room_${payload.leave}`);

    client.join(`room_${payload.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: any) {
    const message = await this.prisma.message.create({
      data: {
        body: payload.body,
        from: client.id,
        room: { connect: { id: payload.roomId } },
      },
    });

    // const message = {
    //   date: new Date().getTime(),
    //   body: payload.body,
    //   from: client.id,
    // };
    // client.join(`room_${payload.roomId}`);

    this.server.to(`room_${payload.roomId}`).emit('message', message);
  }

  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room: string) {
    console.log(`chao room_${room}`);
    client.leave(`room_${room}`);
  }
}
