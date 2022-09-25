import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ResidueType } from './form.entity';

export enum DocumentType {
  INVOICE = 'INVOICE',
  VIDEO = 'VIDEO',
}

registerEnumType(DocumentType, {
  name: 'DocumentType',
  description: 'Represents the document type',
});

@ObjectType()
export class S3 {
  @Field({ nullable: true })
  videoCreateUrl: string;

  @Field({ nullable: true })
  videoFileName: string;

  @Field({ nullable: true })
  invoiceCreateUrl: string;

  @Field({ nullable: true })
  invoiceFileName: string;

  @Field(() => ResidueType)
  residue: ResidueType;
}
