import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class S3 {
  @Field()
  createUrl: string;

  @Field()
  fileName: string;
}
