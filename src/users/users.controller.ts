import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/util/constants';
import { AuthUser, CurrentUser } from 'src/auth/current-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('me')
  @UseGuards(AuthorizationGuard)
  create(@CurrentUser() currentUser: AuthUser) {
    return this.usersService.createUser({ authUserId: currentUser.sub });
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthorizationGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthorizationGuard)
  findOne(@CurrentUser() currentUser: AuthUser) {
    return this.usersService.findUserByAuthUserId(currentUser.sub);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log(file);
    console.log('body', body);
  }
}
