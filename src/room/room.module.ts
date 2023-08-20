import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Repository } from './room.repository';

@Module({
  controllers: [RoomController],
  providers: [RoomService, Repository],
})
export class RoomModule {}
