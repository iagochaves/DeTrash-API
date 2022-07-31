import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFormInput {
  authUserId: string;

  @Field({ nullable: true })
  fileName?: string;

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
}
