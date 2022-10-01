import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Form } from './form.entity';

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
export class Document {
  @Field(() => ID)
  id: string;

  @Field(() => ResidueType)
  residueType: ResidueType;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  videoFileName: string;

  @Field(() => [String])
  invoicesFileName: string[];

  @Field(() => Form)
  form: Form;
  formId: string;

  @Field(() => Date)
  createdAt: Date;
}
