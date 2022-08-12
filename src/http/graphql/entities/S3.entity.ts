import { Field, ObjectType } from '@nestjs/graphql';
import { ResidueType } from './form.entity';

@ObjectType()
export class S3 {
  @Field({ nullable: true })
  createUrl: string;

  @Field({ nullable: true })
  fileName: string;

  @Field(() => ResidueType, { nullable: true })
  residue: ResidueType;
}
