import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Permissions {
  @Field()
  type: string;
}
