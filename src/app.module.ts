import { Module } from '@nestjs/common';
import { Gateway } from './gateway/gateway.gateway';
import { RoomModule } from './room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [],
  providers: [Gateway],
})
export class AppModule {}
