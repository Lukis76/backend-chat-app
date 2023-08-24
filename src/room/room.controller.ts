import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Order, Room } from './entities/room.entity';
import { RoomService } from './room.service';

interface StructureRoomController {
  create(createRoomDto: CreateRoomDto): Promise<Room>;
  search(search: string, take: string, order: Order): Promise<Room[]>;
  findById(id: string): Promise<Room>;
  update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room>;
  remove(id: string): Promise<Room>;
}

@Controller('room')
export class RoomController implements StructureRoomController {
  constructor(
    @Inject(RoomService)
    private readonly roomService: RoomService,
  ) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  async search(
    @Query('search') search: string,
    @Query('take') take: string,
    @Query('order') order: Order,
  ) {
    return await this.roomService.searchRooms({ search, take, order });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const uniqueRoom = await this.roomService.findOne({ id: +id });
    if (!uniqueRoom) {
      throw new NotFoundException('Invalid id');
    }
    return uniqueRoom;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update({ id: +id, data: updateRoomDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
