import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { CreateUserInput } from 'src/http/graphql/inputs/create-user-input';
import { ListFiltersInput } from 'src/http/graphql/inputs/list-filters-input';
import { UpdateUserInput } from 'src/http/graphql/inputs/update-user-input';
import { getFilters } from 'src/util/getFilters';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  updateLastLogin(authUserId: string) {
    return this.prisma.user.update({
      where: {
        authUserId,
      },
      data: {
        lastLoginDate: new Date(),
      },
    });
  }

  async createUser({ authUserId, ...userInfo }: CreateUserInput) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        authUserId,
      },
    });

    if (userExists) {
      throw new BadRequestException(MessagesHelper.USER_EXISTS);
    }

    const user = await this.prisma.user.create({
      data: {
        authUserId,
        ...userInfo,
      },
    });

    return user;
  }

  async updateUser({ authUserId, profileType }: UpdateUserInput) {
    const currentUser = await this.findUserByAuthUserId(authUserId);

    if (profileType) {
      return this.prisma.user.update({
        where: {
          authUserId,
        },
        data: {
          profileType,
        },
      });
    }

    return currentUser;
  }

  findAll(filters?: ListFiltersInput) {
    let filterOptions = [];

    if (filters) {
      filterOptions = getFilters(filters);
    }

    return this.prisma.user.findMany({
      where: {
        AND: filterOptions,
      },
    });
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

  async findUserByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);

    return user;
  }
}
