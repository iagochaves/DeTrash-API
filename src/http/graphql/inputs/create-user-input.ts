import { Field, InputType } from '@nestjs/graphql';
import { ProfileType } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  authUserId: string;

  @Field(() => ProfileType)
  profileType: ProfileType;
}
