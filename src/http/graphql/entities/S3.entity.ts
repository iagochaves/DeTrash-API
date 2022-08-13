import { Field, ObjectType } from '@nestjs/graphql';
import { ResidueType } from './form.entity';

@ObjectType()
export class S3 {
  @Field()
  createUrl: string;

  @Field()
  fileName: string;

  @Field(() => ResidueType)
  residue: ResidueType;
}
