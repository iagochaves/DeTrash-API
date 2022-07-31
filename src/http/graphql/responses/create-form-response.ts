import { Field, ObjectType } from '@nestjs/graphql';
import { Form } from '../entities/form.entity';
import { S3 } from '../entities/S3.entity';

@ObjectType()
export class CreateFormResponse {
  @Field(() => Form)
  form: Form;

  @Field(() => S3, {
    description: 'Field regarding informations on AWS S3',
    nullable: true,
  })
  s3?: S3;
}
