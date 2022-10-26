import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterOptions {
  @Field(() => Date, { nullable: true })
  lt: Date;

  @Field(() => Date, { nullable: true })
  gt: Date;

  @Field(() => Date, { nullable: true })
  lte: Date;

  @Field(() => Date, { nullable: true })
  gte: Date;
}

@InputType()
export class ListFiltersInput {
  @Field(() => FilterOptions, { nullable: true })
  createdAt: FilterOptions;
}
