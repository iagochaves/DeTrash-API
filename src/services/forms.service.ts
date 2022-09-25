import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { ResidueType } from 'src/http/graphql/entities/form.entity';
import { DocumentType } from 'src/http/graphql/entities/S3.entity';
import { ProfileType } from 'src/http/graphql/entities/user.entity';
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

  async getFormDocumentsUrl(
    formId: string,
    residueType: ResidueType,
    documentType: DocumentType,
  ) {
    const formData = await this.findByFormId(formId);

    const residueFieldByDocument =
      documentType === DocumentType.INVOICE
        ? RESIDUES_FIELDS_BY_TYPE[residueType].invoiceFileNameField
        : RESIDUES_FIELDS_BY_TYPE[residueType].videoFileNameField;

    if (!formData[residueFieldByDocument])
      throw new BadRequestException(MessagesHelper.FORM_DOES_NOT_HAVE_DOCUMENT);

    return this.s3Service.getPreSignedObjectUrl(
      formData[residueFieldByDocument],
    );
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

  async createForm({
    authUserId,
    walletAddress,
    ...restFormData
  }: CreateFormInput) {
    const user = await this.usersService.findUserByAuthUserId(authUserId);

    const hasUploadedVideoOrInvoice = Object.entries(restFormData).some(
      ([, residueProps]) =>
        residueProps?.videoFileName || residueProps?.invoiceFileName,
    );

    if (
      user.profileType !== ProfileType.RECYCLER &&
      user.profileType !== ProfileType.WASTE_GENERATOR &&
      hasUploadedVideoOrInvoice
    ) {
      throw new ForbiddenException(
        MessagesHelper.USER_DOES_NOT_HAS_PERMISSION_TO_UPLOAD,
      );
    }
    const formData = {} as CreateFormInput;
    let responseData = [];

    if (hasUploadedVideoOrInvoice) {
      const s3Data = await Object.entries(restFormData).reduce(
        async (asyncAllObjects, [residueType, residueProps]) => {
          const allDocuments = await asyncAllObjects;

          let s3CreateVideoFileName = '';
          let s3CreateInvoiceFileName = '';

          const databaseResidueVideoField =
            RESIDUES_FIELDS_BY_TYPE[residueType].videoFileNameField;

          const databaseResidueInvoiceField =
            RESIDUES_FIELDS_BY_TYPE[residueType].invoiceFileNameField;

          if (residueProps.videoFileName) {
            const { fileName: s3FileName, createUrl } =
              await this.s3Service.createPreSignedObjectUrl(
                residueProps.videoFileName,
                residueType,
              );

            s3CreateVideoFileName = createUrl;

            Object.assign(formData, {
              [databaseResidueVideoField]: s3FileName,
            });
          }

          if (residueProps.invoiceFileName) {
            const { fileName: s3FileName, createUrl } =
              await this.s3Service.createPreSignedObjectUrl(
                residueProps.invoiceFileName,
                residueType,
              );
            s3CreateInvoiceFileName = createUrl;

            Object.assign(formData, {
              [databaseResidueInvoiceField]: s3FileName,
            });
          }

          const databaseResidueAmountField =
            RESIDUES_FIELDS_BY_TYPE[residueType].amountField;

          Object.assign(formData, {
            [databaseResidueAmountField]: residueProps.amount,
          });
          return [
            ...allDocuments,
            {
              invoiceCreateUrl: s3CreateInvoiceFileName,
              invoiceFileName: formData[databaseResidueInvoiceField],
              videoCreateUrl: s3CreateVideoFileName,
              videoFileName: formData[databaseResidueVideoField],
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
        walletAddress,
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

  async authorizeForm(formId: string, isFormAuthorized: boolean) {
    // TO DO: Check if form was created by a RECYCLER user, we can assume that until Waste Generator type is available to use
    // Discuss rules for approving Forms by Waste Generator
    const form = await this.findByFormId(formId);

    return this.prismaService.form.update({
      where: {
        id: form.id,
      },
      data: {
        isFormAuthorizedByAdmin: isFormAuthorized,
      },
    });
  }
}
