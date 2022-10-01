import { Args, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/http/auth/roles.decorator';
import { DocumentsService } from 'src/services/documents.service';
import { Role } from 'src/util/constants';
import { Document, ResidueType } from '../entities/document.entity';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private documentsService: DocumentsService) {}

  @Query(() => String)
  @Roles(Role.Admin)
  documentVideoUrlByResidue(
    @Args('formId') formId: string,
    @Args('residueType', { type: () => ResidueType }) residueType: ResidueType,
  ) {
    return this.documentsService.getDocumentVideoUrlByResidue(
      formId,
      residueType,
    );
  }

  @Query(() => [String])
  @Roles(Role.Admin)
  documentInvoicesUrlByResidue(
    @Args('formId') formId: string,
    @Args('residueType', { type: () => ResidueType }) residueType: ResidueType,
  ) {
    return this.documentsService.getDocumentInvoicesUrlByResidue(
      formId,
      residueType,
    );
  }
}
