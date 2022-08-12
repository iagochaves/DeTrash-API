import { ResidueType } from 'src/http/graphql/entities/form.entity';

export enum Role {
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';

export const PERMISSION_SCOPES = {
  [Role.Admin]: ['read:users'],
};

export const ALLOWED_MIMES = ['video/mp4', 'video/webm'];

export const RESIDUES_FIELDS_BY_TYPE = {
  [ResidueType.GLASS]: {
    amountField: 'glassKgs',
    videoFileNameField: 'glassVideoFileName',
  },
  [ResidueType.METAL]: {
    amountField: 'metalKgs',
    videoFileNameField: 'metalVideoFileName',
  },
  [ResidueType.PAPER]: {
    amountField: 'paperKgs',
    videoFileNameField: 'paperVideoFileName',
  },
  [ResidueType.ORGANIC]: {
    amountField: 'organicKgs',
    videoFileNameField: 'organicVideoFileName',
  },
  [ResidueType.PLASTIC]: {
    amountField: 'plasticKgs',
    videoFileNameField: 'plasticVideoFileName',
  },
};
