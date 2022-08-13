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

  @Field(() => Float)
  plasticKgs: number;

  @Field({ nullable: true })
  plasticVideoFileName: string;

  @Field(() => Float)
  paperKgs: number;

  @Field({ nullable: true })
  paperVideoFileName: string;

  @Field(() => Float)
  metalKgs: number;

  @Field({ nullable: true })
  metalVideoFileName: string;

  @Field(() => Float)
  glassKgs: number;

  @Field({ nullable: true })
  glassVideoFileName: string;

  @Field(() => Float)
  organicKgs: number;

  @Field({ nullable: true })
  organicVideoFileName: string;

  @Field(() => User)
  user: User;
  userId: string;

  @Field(() => Date)
  createdAt: Date;
}