import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/auth/current-user';
import { CreateFormDto } from './dto/create-form.dto';
import { FormsService } from './services/forms.service';

@Controller('api/forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  create(
    @CurrentUser() currentUser: AuthUser,
    @Body() createFormData: CreateFormDto,
  ) {
    console.log(createFormData);
    return this.formsService.createForm(createFormData, currentUser.sub);
  }
}
