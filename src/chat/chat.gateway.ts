import { NotFoundException } from '@nestjs/common';
import {
  // MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';
import {
  CreateRoomDto,
  DeleteRoomDto,
  JoinToRoomDto,
  LeaveToRoomDto,
  NewMessageToRoomDto,
  ReceivedMessageDto,
  ViewMessageDto,
} from './dto';

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

  /**
   *
   *
   */

  @SubscribeMessage('create_user')
  async handleCreateUser(client: Socket, payload: { username: string }) {
    const newUser = await this.prisma.user.create({
      data: {
        username: payload.username,
      },
    });
    if (!newUser) {
      throw new NotFoundException('Error create user');
    }
    client.emit('create_user', newUser);
  }

  /**
   *
   *
   */

  @SubscribeMessage('event_join')
  async handleJoin(client: Socket, payload: JoinToRoomDto) {
    console.log('payload', payload);
    const theSocketId = client.id;

    if (payload.leave) {
      this.server.in(theSocketId).socketsLeave(`room_${payload.leave}`);
    }

    const room = await this.prisma.room.update({
      where: { id: payload.roomId },
      data: {
        userInRoom: {
          connect: { id: payload.userId },
        },
      },
    });
    await this.prisma.user.update({
      where: { id: payload.userId },
      data: {
        userInRoom: {
          connect: { id: payload.roomId },
        },
      },
    });

    console.log('room', room);
    if (!room) {
      // this.server.in(theSocketId).socketsLeave(`room_${roomId.id}`);
      throw new NotFoundException('Invalid room');
    }

    this.server.socketsJoin(`room_${room.id}`);
  }

  /**
   *
   *
   */

  @SubscribeMessage('new_message_to_room')
  async handleNewMessageToRoom(client: Socket, payload: NewMessageToRoomDto) {
    console.log('payload', payload);
    const newMessage = await this.prisma.message.create({
      data: {
        content: payload.message,
        user: {
          connect: { id: payload.userId },
        },
        room: {
          connect: { id: payload.roomId },
        },
      },
    });
    if (!newMessage) {
      throw new NotFoundException('Error create message');
    }

    await this.prisma.room.update({
      where: { id: newMessage.roomId },
      data: {
        lastMessage: newMessage.content,
      },
    });

    this.server
      .to(`room_${newMessage.roomId}`)
      .emit('new_message_to_room', newMessage);
  }

  /**
   *
   *
   */

  @SubscribeMessage('leave_to_room')
  async handleLeaveToRoom(client: Socket, payload: LeaveToRoomDto) {
    console.log('payload', payload);
    const theSocketId = client.id;

    const room = await this.prisma.room.update({
      where: { id: payload.leaveId },
      data: {
        userInRoom: {
          disconnect: { id: payload.userId },
        },
      },
    });
    const user = await this.prisma.user.update({
      where: { id: payload.userId },
      data: {
        userInRoom: {
          disconnect: { id: payload.leaveId },
        },
      },
    });
    console.log('room', room);
    if (!room || !user) {
      throw new NotFoundException('Disconnect failed');
    }
    this.server.in(theSocketId).socketsLeave(`room_${payload.leaveId}`);

    console.log('finaly', { room, user });
  }

  /**
   *
   *
   */

  @SubscribeMessage('create_room')
  async handleJoinRoom(client: Socket, payload: CreateRoomDto) {
    console.log('payload', payload);
    const room = await this.prisma.room.create({
      data: {
        name: payload.name,
        // image: payload.image,
        admin: {
          connect: { id: +payload.userId },
        },
        userInRoom: {
          connect: { id: +payload.userId },
        },
        members: {
          connect: { id: +payload.userId },
        },
      },
    });

    console.log('room', room);
    if (!room) {
      throw new NotFoundException('Invalid room');
    }

    this.server.emit('create_room', room);

    client.join(`room_${room.id}`);
    console.log('finaly', room);
  }

  /**
   *
   *
   */

  @SubscribeMessage('delete_room')
  async handleDeleteRoom(client: Socket, payload: DeleteRoomDto) {
    console.log('payload', payload);
    const theSocketId = client.id;
    const room = await this.prisma.room.delete({
      where: { id: payload.roomId },
    });

    console.log('room', room);
    if (!room) {
      throw new NotFoundException('Delete room failed');
    }
    const user = await this.prisma.user.update({
      where: { id: payload.userId },
      data: {
        userInRoom: {
          disconnect: { id: payload.roomId },
        },
        memberRoom: {
          disconnect: { id: payload.roomId },
        },
        // MemberRooms: {
        //   disconnect: {
        //     userId_roomId: {
        //       roomId: payload.roomId,
        //       userId: payload.userId,
        //     },
        //   },
        // },
        adminRoom: {
          disconnect: {
            id: payload.roomId,
          },
        },
        roomConnect: {
          disconnect: {
            userId_roomId: {
              roomId: payload.roomId,
              userId: payload.userId,
            },
          },
        },
        messages: {
          deleteMany: {
            roomId: payload.roomId,
          },
        },
      },
    });

    console.log('delete room desconnect user', user);
    if (!user) {
      throw new NotFoundException('USer disconnect Room failed');
    }

    this.server.in(theSocketId).socketsLeave(`room_${payload.roomId}`);

    console.log('finaly', room);
  }

  /**
   *
   *
   */

  @SubscribeMessage('received_message')
  handleReceivedMessage(client: Socket, payload: ReceivedMessageDto) {
    console.log('payload', payload);
  }

  /**
   *
   *
   */

  @SubscribeMessage('view_message')
  handleViewMessage(client: Socket, payload: ViewMessageDto) {
    console.log('payload', payload);
  }

  /**
   *
   *
   */
}
