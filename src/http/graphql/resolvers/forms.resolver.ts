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
import { DocumentsService } from 'src/services/documents.service';
import { FormsService } from 'src/services/forms.service';
import { UsersService } from 'src/services/users.service';
import { Role } from 'src/util/constants';
import { Document } from '../entities/document.entity';
import { Form } from '../entities/form.entity';
import { CreateFormInput } from '../inputs/create-form-input';
import { AggregateFormByUserProfileResponse } from '../responses/aggregate-form-by-user-profile-response';
import { CreateFormResponse } from '../responses/create-form-response';
import { SubmitNFTResponse } from '../responses/submit-nft-response';

@Resolver(() => Form)
export class FormsResolver {
  constructor(
    private formsService: FormsService,
    private usersService: UsersService,
    private documentsService: DocumentsService,
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

  @ResolveField(() => [Document])
  documents(@Parent() form: Form) {
    return this.documentsService.listDocumentsFromForm(form.id);
  }

  @Query(() => [AggregateFormByUserProfileResponse])
  @Roles(Role.Admin)
  aggregateFormByUserProfile() {
    return this.formsService.aggregateFormByUserProfile();
  }

  @Query(() => Form)
  @Roles(Role.Admin)
  async form(@Args('formId') formId: string) {
    return this.formsService.findByFormId(formId);
  }

  @Mutation(() => CreateFormResponse)
  createForm(
    @Args('data') data: CreateFormInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.createForm({ authUserId: user.sub, ...data });
  }

  @Mutation(() => Form)
  @Roles(Role.Admin)
  authorizeForm(
    @Args('formId') formId: string,
    @Args('isFormAuthorized') isFormAuthorized: boolean,
  ) {
    return this.formsService.authorizeForm(formId, isFormAuthorized);
  }

  @Mutation(() => String)
  @Roles(Role.Admin)
  submitFormImage(@Args('formId') formId: string) {
    return this.formsService.submitFormImage(formId);
  }

  @Mutation(() => SubmitNFTResponse)
  @Roles(Role.Admin)
  createFormMetadata(@Args('formId') formId: string) {
    return this.formsService.createFormMetadata(formId);
  }
}
