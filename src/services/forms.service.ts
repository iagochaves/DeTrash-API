import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { ResidueType } from 'src/http/graphql/entities/form.entity';
import { CreateFormInput } from 'src/http/graphql/inputs/create-form-input';
import { RESIDUES_FIELDS_BY_TYPE } from 'src/util/constants';
import { S3Service } from './s3.service';
import { UsersService } from './users.service';

@Injectable()
export class FormsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  async getFormVideoUrl(formId: string, residueType: ResidueType) {
    const formData = await this.findByFormId(formId);

    const residueVideoField =
      RESIDUES_FIELDS_BY_TYPE[residueType].videoFileNameField;

    if (!formData[residueVideoField])
      throw new BadRequestException(MessagesHelper.FORM_DOES_NOT_HAVE_VIDEO);

    return this.s3Service.getPreSignedObjectUrl(formData[residueVideoField]);
  }

  async findByFormId(id: string) {
    const form = await this.prismaService.form.findUnique({
      where: {
        id,
      },
    });

    if (!form) throw new NotFoundException(MessagesHelper.FORM_NOT_FOUND);

    return form;
  }

  listAllForms() {
    return this.prismaService.form.findMany();
  }

  async listFormDetails() {
    const [aggregateRecyclerData, aggregateWasteGenData] = await Promise.all([
      this.prismaService.form.aggregate({
        _sum: {
          glassKgs: true,
          metalKgs: true,
          organicKgs: true,
          paperKgs: true,
          plasticKgs: true,
        },
        where: {
          user: {
            is: {
              profileType: 'RECYCLER',
            },
          },
        },
      }),
      this.prismaService.form.aggregate({
        _sum: {
          glassKgs: true,
          metalKgs: true,
          organicKgs: true,
          paperKgs: true,
          plasticKgs: true,
        },
        where: {
          user: {
            is: {
              profileType: 'WASTE_GENERATOR',
            },
          },
        },
      }),
    ]);

    return [
      {
        id: 'RECYCLER',
        data: aggregateRecyclerData._sum,
      },
      {
        id: 'WASTE_GENERATOR',
        data: aggregateWasteGenData._sum,
      },
    ];
  }

  async createForm({ authUserId, ...restFormData }: CreateFormInput) {
    const user = await this.usersService.findUserByAuthUserId(authUserId);

    const hasUploadedVideo = Object.entries(restFormData).some(
      ([, residueProps]) => residueProps?.videoFileName,
    );

    if (user.profileType !== 'RECYCLER' && hasUploadedVideo) {
      throw new ForbiddenException(MessagesHelper.USER_NOT_RECYCLER);
    }
    const formData = {} as CreateFormInput;
    let responseData = [];

    if (hasUploadedVideo) {
      const s3Data = await Object.entries(restFormData).reduce(
        async (asyncAllVideos, [residueType, residueProps]) => {
          const allVideos = await asyncAllVideos;

          const { fileName: s3FileName, createUrl } =
            await this.s3Service.createPreSignedObjectUrl(
              residueProps.videoFileName,
              residueType,
            );

          const databaseResidueVideoField =
            RESIDUES_FIELDS_BY_TYPE[residueType].videoFileNameField;

          const databaseResidueAmountField =
            RESIDUES_FIELDS_BY_TYPE[residueType].amountField;

          Object.assign(formData, {
            [databaseResidueVideoField]: s3FileName,
            [databaseResidueAmountField]: residueProps.amount,
          });

          return [
            ...allVideos,
            {
              fileName: s3FileName,
              createUrl,
              residue: residueType,
            },
          ];
        },
        Promise.resolve([]),
      );

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
