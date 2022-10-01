import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ProfileType } from '../entities/user.entity';

@ObjectType()
export class AggregateFormByUserProfileResponse {
  @Field(() => ProfileType)
  id: ProfileType;

  @Field(() => Float)
  data: number;
}
