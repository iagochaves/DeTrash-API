import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagesHelper } from './helpers/messages.helper';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateLastLogin(authUserId: string) {
    await this.prisma.user.update({
      where: {
        authUserId,
      },
      data: {
        lastLoginDate: new Date(),
      },
    });
  }

  async createUser({ authUserId }: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        authUserId,
      },
    });

    if (userExists) {
      throw new ForbiddenException(MessagesHelper.USER_EXISTS);
    }

    const user = await this.prisma.user.create({
      data: {
        authUserId,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findUserByAuthUserId(authUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        authUserId,
      },
    });

    if (!user) throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);

    await this.updateLastLogin(authUserId);

    return user;
  }
}
