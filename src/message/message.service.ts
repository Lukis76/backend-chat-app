import { Injectable } from '@nestjs/common';
// import { CreateMessageDto } from './dto/create-message.dto';
// import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}
  async getPaginatedMessages(roomId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const messages = await this.prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: +pageSize,
    });

    const totalMessages = await this.prisma.message.count({
      where: {
        roomId: roomId,
      },
    });

    const nextPage = page * pageSize < totalMessages ? page + 1 : null;
    const lastPage = page > 1 ? page - 1 : null;

    const result = {
      messages,
      totalMessages,
      nextPage,
      lastPage,
    };

    return result;
  }

  // create(createMessageDto: CreateMessageDto) {
  //   return 'This action adds a new message';
  // }

  // findAll() {
  //   return `This action returns all message`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
