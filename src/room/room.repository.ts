import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export class Repository {
  constructor(private prisma: PrismaService) {}

  async createRoom(createRoomDto: Prisma.RoomCreateInput) {
    return await this.prisma.room.create({
      data: createRoomDto,
    });
  }

  async findRoom(where: Prisma.RoomFindUniqueArgs['where']) {
    return await this.prisma.room.findUnique({
      where,
    });
  }

  async findAllRooms() {
    const result = await this.prisma.room.findMany();
    console.log(
      '🚀 ~ file: room.repository.ts:21 ~ Repository ~ findAllRooms ~ result:',
      result,
    );
    return result;
  }
}