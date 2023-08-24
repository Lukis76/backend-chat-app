import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomWhereUniqueInput } from './entities/room.entity';
import { RoomRepository } from './room.repository';

class SearchParams {
  search: string;
  take: string;
  order: string;
}

@Injectable()
export class RoomService {
  constructor(
    @Inject(RoomRepository)
    private readonly roomRepository: RoomRepository,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return await this.roomRepository.create({ ...createRoomDto });
  }

  async searchRooms(searchParams: SearchParams): Promise<Room[]> {
    // Implementa la lógica de búsqueda aquí utilizando Prisma ORM
    //TODO: implementar la lìgica de bésqueda aquí y paguinado de rooms con limitacion
    return await this.roomRepository.findSearch(searchParams);
  }

  async findOne(where: RoomWhereUniqueInput): Promise<Room> {
    return await this.roomRepository.findUnique({ where });
  }

  async update(updateRoom: { data: UpdateRoomDto; id: number }) {
    return await this.roomRepository.update({ ...updateRoom });
  }

  async remove(id: number) {
    return await this.roomRepository.remove({
      id,
    });
  }
}
