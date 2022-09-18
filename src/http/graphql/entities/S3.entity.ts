import { Field, ObjectType } from '@nestjs/graphql';
import { ResidueType } from './form.entity';

@ObjectType()
export class S3 {
  @Field({ nullable: true })
  videoCreateUrl: string;

  @Field({ nullable: true })
  videoFileName: string;

  @Field({ nullable: true })
  invoiceCreateUrl: string;

  @Field({ nullable: true })
  invoiceFileName: string;

  @Field(() => ResidueType)
  residue: ResidueType;
}
