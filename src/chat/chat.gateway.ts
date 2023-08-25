import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';
import { JoinToRoomDto } from './dto';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway(4000, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('jion-to-room')
  handleJoinToRoom(client: Socket, payload: JoinToRoomDto) {
    console.log('jion-to-room => ', payload);
    client.join(`room_${payload.roomId}`);
  }

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   */

  @SubscribeMessage('event_change_room')
  async handleJoinRoom(client: Socket, payload: any) {
    console.log(
      '🚀 ~ file: chat.gateway.ts:27 ~ ChatGateway ~ handleJoinRoom ~ payload:',
      payload,
    );
    // const theSocketId = client.id;
    // this.server.in(theSocketId).socketsLeave(`room_${payload.leave}`);
    // const room = await this.prisma.room.findUnique({
    //   where: { id: payload.roomId },
    // });
    // console.log(
    //   '🚀 ~ file: chat.gateway.ts:33 ~ ChatGateway ~ handleJoinRoom ~ room:',
    //   room,
    // );
    // if (!room) {
    //   // this.server.in(theSocketId).socketsLeave(`room_${roomId.id}`);
    //   throw new NotFoundException('Invalid room');
    // }

    client.join(`room_${payload.roomId}`);
  }

  @SubscribeMessage('event_message')
  async handleMessage(client: Socket, payload: any) {
    console.log(
      '🚀 ~ file: chat.gateway.ts:42 ~ ChatGateway ~ handleMessage ~ payload:',
      payload,
    );

    const message = await this.prisma.message.create({
      data: {
        body: payload.body,
        from: client.id,
        room: { connect: { id: payload.roomId } },
      },
    });
    console.log(
      '🚀 ~ file: chat.gateway.ts:58 ~ ChatGateway ~ handleMessage ~ message:',
      message,
    );

    this.server.to(`room_${payload.roomId}`).emit('message', message);
  }

  @SubscribeMessage('event_leave')
  handleRoomLeave(client: Socket, room: string) {
    console.log(`chao room_${room}`);
    client.leave(`room_${room}`);
  }

  @SubscribeMessage('create_room')
  async create(client: Socket, @MessageBody() createChatDto: CreateChatDto) {
    const room = await this.prisma.room.create({
      data: {
        name: createChatDto.name,
        users: createChatDto.users,
      },
    });
    client.join(`room_${room.id}`);

    // return this.chatService.create(createChatDto);
  }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  @SubscribeMessage('remove_room')
  async remove(@MessageBody() roomId: number) {
    await this.prisma.room.delete({
      where: { id: roomId },
      include: { messages: true },
    });
    // return this.chatService.remove(id);
  }
}
