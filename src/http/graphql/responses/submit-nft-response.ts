import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubmitNFTResponse {
  @Field()
  createMetadataUrl: string;

  @Field()
  body: string;
}
