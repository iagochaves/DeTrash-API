import { Field, ObjectType } from '@nestjs/graphql';
import { ResidueType } from './document.entity';

@ObjectType()
export class S3 {
  @Field({ nullable: true })
  videoCreateUrl: string;

  @Field({ nullable: true })
  videoFileName: string;

  @Field(() => [String])
  invoicesCreateUrl: string[];

  @Field(() => [String])
  invoicesFileName: string[];

  @Field(() => ResidueType)
  residue: ResidueType;
}
