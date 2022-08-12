import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from './user.entity';

export enum ResidueType {
  GLASS = 'GLASS',
  METAL = 'METAL',
  ORGANIC = 'ORGANIC',
  PAPER = 'PAPER',
  PLASTIC = 'PLASTIC',
}

registerEnumType(ResidueType, {
  name: 'ResidueType',
  description: 'Represents the residue type',
});

@ObjectType()
export class Form {
  @Field(() => ID)
  id: string;

  @Field(() => Float, { nullable: true })
  plasticKgs?: number;

  @Field({ nullable: true })
  plasticVideoFileName: string;

  @Field(() => Float, { nullable: true })
  paperKgs?: number;

  @Field({ nullable: true })
  paperVideoFileName: string;

  @Field(() => Float, { nullable: true })
  metalKgs?: number;

  @Field({ nullable: true })
  metalVideoFileName: string;

  @Field(() => Float, { nullable: true })
  glassKgs?: number;

  @Field({ nullable: true })
  glassVideoFileName: string;

  @Field(() => Float, { nullable: true })
  organicKgs?: number;

  @Field({ nullable: true })
  organicVideoFileName: string;

  @Field(() => User)
  user: User;
  userId: string;

  @Field(() => Date)
  createdAt: Date;
}
