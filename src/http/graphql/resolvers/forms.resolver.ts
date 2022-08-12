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
import { Form, ResidueType } from '../entities/form.entity';
import { CreateFormInput } from '../inputs/create-form-input';
import { AggregateFormByUserProfileResponse } from '../responses/aggregate-form-by-user-profile-response';
import { CreateFormResponse } from '../responses/create-form-response';

@Resolver(() => Form)
export class FormsResolver {
  constructor(
    private formsService: FormsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [Form])
  @Roles(Role.Admin)
  async forms() {
    return this.formsService.listAllForms();
  }

  @ResolveField()
  user(@Parent() form: Form) {
    return this.usersService.findUserByUserId(form.userId);
  }

  @Query(() => [AggregateFormByUserProfileResponse])
  aggregateFormByUserProfile() {
    return this.formsService.listFormDetails();
  }

  @Query(() => Form)
  async form(@Args('formId') formId: string) {
    return this.formsService.findByFormId(formId);
  }

  @Query(() => String)
  formVideoUrlByResidue(
    @Args('formId') formId: string,
    @Args('residueType', { type: () => ResidueType }) residueType: ResidueType,
  ) {
    return this.formsService.getFormVideoUrl(formId, residueType);
  }

  @Mutation(() => CreateFormResponse)
  createForm(
    @Args('data') data: CreateFormInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.createForm({ authUserId: user.sub, ...data });
  }
}
