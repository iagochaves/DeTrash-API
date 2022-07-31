import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class Form {
  @Field(() => ID)
  formId: string;

  @Field({ nullable: true })
  recyclerVideoFileName: string;

  @Field(() => Float, { nullable: true })
  plasticKgs?: number;

  @Field(() => Float, { nullable: true })
  paperKgs?: number;

  @Field(() => Float, { nullable: true })
  metalKgs?: number;

  @Field(() => Float, { nullable: true })
  glassKgs?: number;

  @Field(() => Float, { nullable: true })
  organicKgs?: number;

  @Field(() => User)
  user: User;
  userId: string;

  @Field(() => Date)
  createdAt: Date;
}
