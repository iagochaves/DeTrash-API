import { Field, ObjectType } from '@nestjs/graphql';
import { Permissions } from '../entities/permissions.entity';
import { User } from '../entities/user.entity';

@ObjectType()
export class Me extends User {
  @Field(() => [Permissions])
  permissions: Permissions[];
}
