import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ProfileType } from '../entities/user.entity';

@ObjectType()
class AggregateFormData {
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

@ObjectType()
export class AggregateFormByUserProfileResponse {
  @Field(() => ProfileType)
  id: ProfileType;

  @Field(() => AggregateFormData)
  data: AggregateFormData;
}
