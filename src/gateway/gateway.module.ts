import { Module } from '@nestjs/common';
import { Gateway } from './gateway.gateway';

@Module({
  providers: [Gateway],
})
export class GatewayModule {}
