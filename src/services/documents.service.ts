import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { ResidueType } from 'src/http/graphql/entities/document.entity';
import { S3Service } from './s3.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  findAll() {
    return this.prisma.document.findMany();
  }

  async listDocumentsFromForm(formId: string) {
    const form = await this.prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) throw new NotFoundException(MessagesHelper.FORM_NOT_FOUND);

    return this.prisma.document.findMany({
      where: {
        formId: form.id,
      },
    });
  }

  async findByResidueAndForm(residueType: ResidueType, formId: string) {
    const form = await this.prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!form) throw new NotFoundException(MessagesHelper.FORM_NOT_FOUND);

    const document = await this.prisma.document.findFirst({
      where: {
        AND: {
          formId: form.id,
          residueType,
        },
      },
    });

    if (!document)
      throw new NotFoundException(MessagesHelper.DOCUMENT_NOT_FOUND);

    return document;
  }

  async getDocumentVideoUrlByResidue(formId: string, residueType: ResidueType) {
    const document = await this.findByResidueAndForm(residueType, formId);

    return this.s3Service.getPreSignedObjectUrl(document.videoFileName);
  }

  async getDocumentInvoicesUrlByResidue(
    formId: string,
    residueType: ResidueType,
  ) {
    const document = await this.findByResidueAndForm(residueType, formId);

    return Promise.all(
      document.invoicesFileName.map((invoice) =>
        this.s3Service.getPreSignedObjectUrl(invoice),
      ),
    );
  }
}
