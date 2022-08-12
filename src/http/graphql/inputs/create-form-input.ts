import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFormInput {
  authUserId: string;

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
}
