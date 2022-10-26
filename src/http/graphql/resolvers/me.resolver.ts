import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { FormsService } from 'src/services/forms.service';
import { UsersService } from 'src/services/users.service';
import { Form } from '../entities/form.entity';
import { User } from '../entities/user.entity';
import { ListFiltersInput } from '../inputs/list-filters-input';
import { Me } from '../responses/get-me-response';

@Resolver(() => Me)
export class MeResolver {
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

  @ResolveField(() => [Form])
  forms(
    @Parent() user: User,
    @Args('filter', { type: () => ListFiltersInput, nullable: true })
    filter: ListFiltersInput,
  ) {
    return this.formsService.listAllFromUserByUserId(user.id, filter);
  }
}
