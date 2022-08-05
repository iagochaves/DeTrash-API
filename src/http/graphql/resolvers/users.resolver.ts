import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { Roles } from 'src/http/auth/roles.decorator';
import { FormsService } from 'src/services/forms.service';
import { UsersService } from 'src/services/users.service';
import { Role } from 'src/util/constants';
import { Form } from '../entities/form.entity';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../inputs/create-user-input';
import { UpdateUserInput } from '../inputs/update-user-input';
import { Me } from '../responses/get-me-response';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private formsService: FormsService,
  ) {}

  @Query(() => Me)
  async me(@CurrentUser() user: AuthUser) {
    const userData = await this.usersService.findUserByAuthUserId(user.sub);

    const permissions = user?.permissions?.length
      ? user.permissions.map((permissionType) => ({
          type: permissionType,
        }))
      : [];

    return {
      permissions,
      ...userData,
    };
  }

  @Query(() => User)
  @Roles(Role.Admin)
  user(@Args('userAuthId') authUserId: string) {
    return this.usersService.findUserByAuthUserId(authUserId);
  }

  @Query(() => [User])
  @Roles(Role.Admin)
  users() {
    return this.usersService.findAll();
  }

  @ResolveField(() => [Form])
  forms(@Parent() user: User) {
    return this.formsService.listAllFromUserByUserId(user.id);
  }

  @Mutation(() => User)
  createUser(
    @Args('data') data: CreateUserInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.createUser({ authUserId: user.sub, ...data });
  }

  @Mutation(() => User)
  updateUser(
    @Args('data') data: UpdateUserInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usersService.updateUser({ authUserId: user.sub, ...data });
  }
}
