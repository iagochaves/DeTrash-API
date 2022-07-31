import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class S3 {
  @Field({ nullable: true })
  createUrl: string;

  @Field({ nullable: true })
  fileName: string;
}
