import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Form, ResidueType } from './form.entity';

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
