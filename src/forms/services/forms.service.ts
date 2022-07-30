import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateFormDto } from '../dto/create-form.dto';
import { IS3CreateResponseData } from '../dto/s3.dto';
import { S3Service } from './s3.service';

@Injectable()
export class FormsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  // RecyclerUser(authUserId: string) {
  //   return this.prismaService.user.findUnique({
  //     where: { profileType: '' },
  //   });
  // }

  async createForm(
    { fileName, ...materialType }: CreateFormDto,
    authUserId: string,
  ) {
    const user = await this.usersService.findUserByAuthUserId(authUserId);
    const formData = {} as CreateFormDto;
    let responseData = {} as IS3CreateResponseData;

    const filteredMaterial = Object.entries(materialType).filter(
      ([, materialValue]) => Boolean(materialValue),
    );

    Object.assign(formData, Object.fromEntries(filteredMaterial));

    if (fileName) {
      const s3Data = await this.s3Service.createPreSignedObjectUrl(fileName);

      Object.assign(formData, { recyclerVideoFileName: s3Data.name });
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
}
