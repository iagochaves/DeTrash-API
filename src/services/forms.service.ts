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
import { RESIDUES_FIELD_BY_TYPE } from 'src/util/constants';
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

    const residueField = RESIDUES_FIELD_BY_TYPE[residueType];

    if (!formData[residueField])
      throw new BadRequestException(MessagesHelper.FORM_DOES_NOT_HAVE_VIDEO);

    return this.s3Service.getPreSignedObjectUrl(formData[residueField]);
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

    const {
      glassVideoFileName,
      metalVideoFileName,
      paperVideoFileName,
      organicVideoFileName,
      plasticVideoFileName,
      ...materialType
    } = restFormData;

    const residuesVideos = [
      {
        key: ResidueType.GLASS,
        fileName: glassVideoFileName,
        field: 'glassVideoFileName',
      },
      {
        key: ResidueType.METAL,
        fileName: metalVideoFileName,
        field: 'metalVideoFileName',
      },
      {
        key: ResidueType.PAPER,
        fileName: paperVideoFileName,
        field: 'paperVideoFileName',
      },
      {
        key: ResidueType.ORGANIC,
        fileName: organicVideoFileName,
        field: 'organicVideoFileName',
      },
      {
        key: ResidueType.PLASTIC,
        fileName: plasticVideoFileName,
        field: 'plasticVideoFileName',
      },
    ].filter((residues) => Boolean(residues.fileName));

    if (user.profileType !== 'RECYCLER' && residuesVideos.length) {
      throw new ForbiddenException(MessagesHelper.USER_NOT_RECYCLER);
    }
    const formData = {} as CreateFormInput;
    let responseData = [];

    const filteredMaterial = Object.entries(materialType).filter(
      ([, materialValue]) => Boolean(materialValue),
    );

    Object.assign(formData, Object.fromEntries(filteredMaterial));

    if (residuesVideos.length) {
      const s3Data = await residuesVideos.reduce(
        async (asyncAllVideos, { key, fileName, field }) => {
          const allVideos = await asyncAllVideos;

          const { fileName: s3FileName, createUrl } =
            await this.s3Service.createPreSignedObjectUrl(fileName, key);

          Object.assign(formData, { [field]: s3FileName });

          return [
            ...allVideos,
            {
              fileName: s3FileName,
              createUrl,
              residue: key,
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
