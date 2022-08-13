import { Field, InputType } from '@nestjs/graphql';
import { ProfileType } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  authUserId: string;

  @Field()
  name: string;

  @Field(() => ProfileType)
  profileType: ProfileType;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;
}
