import { RoomCreateInput } from '../entities/room.entity';

export class CreateRoomDto implements RoomCreateInput {
  name: string;
}
