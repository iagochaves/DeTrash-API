import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ResidueType } from '../entities/document.entity';
import { ProfileType } from '../entities/user.entity';

@ObjectType()
class AggregateFormData {
  @Field(() => Float)
  amount: number;

  @Field(() => ResidueType)
  residueType: ResidueType;
}

@ObjectType()
export class AggregateFormByUserProfileResponse {
  @Field(() => ProfileType)
  id: ProfileType;

  @Field(() => [AggregateFormData])
  data: AggregateFormData[];
}
