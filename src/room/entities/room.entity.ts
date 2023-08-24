import { Prisma, Room as Space } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export type Room = Space;

export class RoomCreateInput implements Prisma.RoomCreateInput {
  name: string;
}

export class RoomUpdateInput implements Prisma.RoomUpdateInput {
  name?: string;
}

export type RoomWhereUniqueInput = Prisma.RoomWhereUniqueInput;

export class RoomWhereInput implements Prisma.RoomWhereInput {
  id?: number;
  name?: string;
}

export class RoomFindUniqueArgs implements Prisma.RoomFindUniqueArgs {
  where: Prisma.RoomWhereUniqueInput;
  select?: Prisma.RoomSelect<DefaultArgs>;
}

export class RoomFindFirstArgs implements Prisma.RoomFindFirstArgs {
  where: RoomWhereInput;
}

export class RoomFindArgs implements Prisma.RoomFindManyArgs {
  where: RoomWhereInput;
}

export class RoomDeleteArgs implements Prisma.RoomDeleteArgs {
  where: Prisma.RoomWhereUniqueInput;
}

// export class Order implements Prisma.SortOrderInput {
//   sort: Prisma.SortOrder;
//   nulls?: Prisma.NullsOrder;
// }
export type Order = Prisma.SortOrder | Prisma.NullsOrder;
