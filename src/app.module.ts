import { Module } from '@nestjs/common';
import { Gateway } from './gateway/gateway.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [Gateway],
})
export class AppModule {}
