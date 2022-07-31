import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { IS3CreateResponseData } from 'src/http/dto/s3.dto';
import { CreateFormInput } from 'src/http/graphql/inputs/create-form-input';
import { S3Service } from './s3.service';
import { UsersService } from './users.service';

@Injectable()
export class FormsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  listAllForms() {
    return this.prismaService.form.findMany();
  }

  async createForm({ authUserId, fileName, ...materialType }: CreateFormInput) {
    const user = await this.usersService.findUserByAuthUserId(authUserId);

    if (user.profileType !== 'RECYCLER') {
      throw new ForbiddenException(MessagesHelper.USER_NOT_RECYCLER);
    }
    const formData = {} as CreateFormInput;
    let responseData = {} as IS3CreateResponseData;

    const filteredMaterial = Object.entries(materialType).filter(
      ([, materialValue]) => Boolean(materialValue),
    );

    Object.assign(formData, Object.fromEntries(filteredMaterial));

    if (fileName) {
      const s3Data = await this.s3Service.createPreSignedObjectUrl(fileName);

      Object.assign(formData, { recyclerVideoFileName: s3Data.fileName });
      responseData = s3Data;
    }

    const form = await this.prismaService.form.create({
      data: {
        ...formData,
        userId: user.id,
      },
    });
    return {
      form,
      s3: responseData,
    };
  }

  async listAllFromUserByUserId(userId: string) {
    return this.prismaService.form.findMany({
      where: {
        userId,
      },
    });
  }
}
