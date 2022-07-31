import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { Roles } from 'src/http/auth/roles.decorator';
import { FormsService } from 'src/services/forms.service';
import { UsersService } from 'src/services/users.service';
import { Role } from 'src/util/constants';
import { CreateUserInput } from '../inputs/create-user-input';
import { User } from '../entities/user.entity';
import { Form } from '../entities/form.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private formsService: FormsService,
  ) {}

  @Query(() => User)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.findUserByAuthUserId(user.sub);
  }

  @Query(() => User)
  @Roles(Role.Admin)
  @UseGuards(AuthorizationGuard)
  user(@Args('userAuthId') authUserId: string) {
    return this.usersService.findUserByAuthUserId(authUserId);
  }

  @Query(() => [User])
  @Roles(Role.Admin)
  @UseGuards(AuthorizationGuard)
  users() {
    return this.usersService.findAll();
  }

  @ResolveField(() => [Form])
  forms(@Parent() user: User) {
    return this.formsService.listAllFromUserByUserId(user.id);
  }

  @Mutation(() => User)
  @UseGuards(AuthorizationGuard)
  createUser(
    @Args('data') data: CreateUserInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.createUser({ authUserId: user.sub, ...data });
  }
}
