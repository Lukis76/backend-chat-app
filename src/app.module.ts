import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [PrismaModule, RoomModule, ChatModule, AuthModule, MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
