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
import { Form } from '../entities/form.entity';
import { CreateFormInput } from '../inputs/create-form-input';
import { CreateFormResponse } from '../responses/create-form-response';

@Resolver(() => Form)
export class FormsResolver {
  constructor(
    private formsService: FormsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [Form])
  @Roles(Role.Admin)
  @UseGuards(AuthorizationGuard)
  async forms() {
    return this.formsService.listAllForms();
  }

  @ResolveField()
  user(@Parent() form: Form) {
    return this.usersService.findUserByUserId(form.userId);
  }

  @Mutation(() => CreateFormResponse)
  @UseGuards(AuthorizationGuard)
  createForm(
    @Args('data') data: CreateFormInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.createForm({ authUserId: user.sub, ...data });
  }
}
