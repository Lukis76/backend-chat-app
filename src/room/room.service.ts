import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
// import { UpdateRoomDto } from './dto/update-room.dto';
import { Repository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(private readonly repository: Repository) {}
  async create(createRoomDto: CreateRoomDto) {
    const exist = this.repository.findRoom({ name: createRoomDto.name });

    if (exist)
      throw new ForbiddenException(
        `The room with the name already exists: ${createRoomDto.name}`,
      );

    return await this.repository.createRoom(createRoomDto);
  }

  async findAll() {
    const result = await this.repository.findAllRooms();
    console.log(
      '🚀 ~ file: room.service.ts:23 ~ RoomService ~ findAll ~ result:',
      result,
    );
    return result;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} room`;
  // }

  // update(id: number, updateRoomDto: UpdateRoomDto) {
  //   return `This action updates a #${id} room`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} room`;
  // }
}
