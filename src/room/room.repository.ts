import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomWhereUniqueInput } from './entities/room.entity';

class SearchParams {
  search: string;
  take: string;
  order: string;
}

@Injectable()
export class RoomRepository {
  limit = 10;
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.prisma.room.create({
      data: {
        ...createRoomDto,
      },
    });
  }

  async findSearch({ search, take, order }: SearchParams): Promise<Room[]> {
    // Implementa la lógica de búsqueda aquí utilizando Prisma ORM
    //TODO: implementar la lìgica de bésqueda aquí y paguinado de rooms con limitacion
    return await this.prisma.room.findMany({
      where: {
        name: {
          contains: search, // Por ejemplo, busca en el campo 'name' que contenga el término de búsqueda
          mode: 'insensitive', // Por defecto, busca en todo el campo, pero si queremos que sea case sensitive, podemos utilizar el parámetro 'mode'
        },
      },
      orderBy: {
        name: Prisma.SortOrder[order] || 'asc', // Por defecto ordena de forma ascendente,
      },
      take: +take || this.limit,
    });
  }

  async findUnique({ where }: { where: RoomWhereUniqueInput }): Promise<Room> {
    return await this.prisma.room.findUnique({
      where,
    });
  }

  async update(updateRoom: { data: UpdateRoomDto; id: number }) {
    return await this.prisma.room.update({
      where: {
        id: updateRoom.id,
      },
      data: updateRoom.data,
    });
  }

  async remove({ id }: { id: number }) {
    return await this.prisma.room.delete({
      where: {
        id,
      },
    });
  }
}
