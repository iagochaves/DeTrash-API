import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { ResidueType } from 'src/http/graphql/entities/form.entity';
import { ProfileType } from 'src/http/graphql/entities/user.entity';
import { CreateFormInput } from 'src/http/graphql/inputs/create-form-input';
import { getResidueTitle } from 'src/util/getResidueTitle';
import { DocumentsService } from './documents.service';
import { S3Service } from './s3.service';
import { UsersService } from './users.service';

@Injectable()
export class FormsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
    private readonly documentsService: DocumentsService,
  ) {}

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
        residueProps?.videoFileName || residueProps.invoicesFileName.length,
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

    let responseData = [];

    const form = await this.prismaService.form.create({
      data: {
        userId: user.id,
        walletAddress,
      },
    });

    if (hasUploadedVideoOrInvoice) {
      const s3Data = await Object.entries(restFormData).reduce(
        async (asyncAllObjects, [residueType, residueProps]) => {
          const allDocuments = await asyncAllObjects;

          const documentEntity = {
            formId: form.id,
            residueType: residueType as ResidueType,
            invoicesFileName: [],
            amount: residueProps.amount,
            videoFileName: null,
          };

          let s3CreateVideoFileName = '';
          const s3CreateInvoiceFileName: string[] = [];

          if (residueProps.videoFileName) {
            const { fileName: s3FileName, createUrl } =
              await this.s3Service.createPreSignedObjectUrl(
                residueProps.videoFileName,
                residueType,
              );

            s3CreateVideoFileName = createUrl;
            documentEntity.videoFileName = s3FileName;
          }

          if (residueProps.invoicesFileName.length) {
            const invoicesS3Response = await Promise.all(
              residueProps.invoicesFileName.map((invoiceFile) => {
                return this.s3Service.createPreSignedObjectUrl(
                  invoiceFile,
                  residueType,
                );
              }),
            );
            invoicesS3Response.forEach(({ createUrl, fileName }) => {
              s3CreateInvoiceFileName.push(createUrl);
              documentEntity.invoicesFileName.push(fileName);
            });
          }

          const residueDocument = await this.prismaService.document.create({
            data: {
              ...documentEntity,
            },
          });

          return [
            ...allDocuments,
            {
              invoicesCreateUrl: s3CreateInvoiceFileName,
              invoicesFileName: residueDocument.invoicesFileName,
              videoCreateUrl: s3CreateVideoFileName,
              videoFileName: residueDocument.videoFileName,
              residue: residueType,
            },
          ];
        },
        Promise.resolve([]),
      );

      responseData = s3Data;
    }

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

  async createOnPublicObject(fileName: string, basePath: string) {
    const publicBucket = 'detrash-public';

    const createPublicUrl = await this.s3Service.createPreSignedObjectUrl(
      fileName,
      '',
      basePath,
      publicBucket,
    );

    return createPublicUrl.createUrl;
  }

  async submitFormImage(formId: string) {
    const form = await this.findByFormId(formId);

    const createImageUrl = this.createOnPublicObject(
      `${form.id}.png`,
      'images',
    );

    return createImageUrl;
  }

  async createFormMetadata(formId: string) {
    const form = await this.findByFormId(formId);

    const [user, documents] = await Promise.all([
      this.usersService.findUserByUserId(form.userId),
      this.documentsService.listDocumentsFromForm(formId),
    ]);

    const residueAttributes = documents.reduce(
      (allAtributes, residueDocument) => {
        const residueTitleFormat = getResidueTitle(residueDocument.residueType);

        allAtributes.push({
          trait_type: `${residueTitleFormat} kgs`,
          value: String(residueDocument.amount),
        });

        return allAtributes;
      },
      [
        {
          trait_type: 'Originating wallet',
          value: form.walletAddress || '0x0',
        },
        {
          trait_type: 'Audit',
          value: form.isFormAuthorizedByAdmin ? 'Verified' : 'Not Verified',
        },
      ],
    );

    const fileName = `${form.id}.json`;
    const createMetadataUrl = await this.createOnPublicObject(
      fileName,
      'metadata',
    );
    const objectUrl = new URL(createMetadataUrl);

    const JsonMetadata = {
      attributes: residueAttributes,
      description: 'RECY Report',
      image: `${objectUrl.origin}/images/${form.id}.png`,
      name: user.email,
    };

    const formMetadataUrl = `${objectUrl.origin}${objectUrl.pathname}`;

    await this.prismaService.form.update({
      where: {
        id: formId,
      },
      data: {
        formMetadataUrl,
      },
    });

    return {
      createMetadataUrl,
      body: JSON.stringify(JsonMetadata, null, 2),
    };
  }

  async test() {
    const forms = await this.prismaService.form.findMany();

    forms.forEach(async (form) => {
      const types = [
        {
          amount: form.glassKgs,
          type: ResidueType.GLASS,
          video: form.glassVideoFileName,
          invoice: form.glassInvoiceFileName,
        },

        {
          amount: form.plasticKgs,
          type: ResidueType.PLASTIC,
          video: form.plasticVideoFileName,
          invoice: form.plasticInvoiceFileName,
        },

        {
          amount: form.metalKgs,
          type: ResidueType.METAL,
          video: form.metalVideoFileName,
          invoice: form.metalInvoiceFileName,
        },

        {
          amount: form.organicKgs,
          type: ResidueType.ORGANIC,
          video: form.organicVideoFileName,
          invoice: form.organicInvoiceFileName,
        },

        {
          amount: form.paperKgs,
          type: ResidueType.PAPER,
          video: form.paperVideoFileName,
          invoice: form.paperInvoiceFilename,
        },
      ];

      const promises = [];

      types.forEach((residueType) => {
        if (Number(residueType.amount) && Number(residueType.amount) > 0) {
          const p = new Promise((resolve) =>
            resolve(
              this.prismaService.document.create({
                data: {
                  amount: residueType.amount,
                  formId: form.id,
                  residueType: residueType.type,
                  videoFileName: residueType.video,
                  invoicesFileName: residueType.invoice,
                },
              }),
            ),
          );
          promises.push(p);
        }
      });

      await Promise.all(promises);
    });

    return 'ok';
  }
}
