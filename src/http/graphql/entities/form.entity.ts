import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document } from './document.entity';
import { User } from './user.entity';

@ObjectType()
export class Form {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  isFormAuthorizedByAdmin: boolean;

  @Field({ nullable: true })
  walletAddress: string;

  @Field({ nullable: true })
  formMetadataUrl: string;

  @Field(() => User)
  user: User;
  userId: string;

  @Field(() => [Document])
  documents: Document[];

  @Field(() => Date)
  createdAt: Date;
}
