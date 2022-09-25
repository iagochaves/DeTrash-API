import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetFormDocumentsUrl {
  @Field({ nullable: true })
  videoFileUrl: string;

  @Field({ nullable: true })
  invoiceFileUrl: string;
}
