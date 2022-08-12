import { ResidueType } from 'src/http/graphql/entities/form.entity';

export enum Role {
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';

export const PERMISSION_SCOPES = {
  [Role.Admin]: ['read:users'],
};

export const ALLOWED_MIMES = ['video/mp4', 'video/webm'];

export const RESIDUES_FIELD_BY_TYPE = {
  [ResidueType.GLASS]: 'glassVideoFileName',
  [ResidueType.METAL]: 'metalVideoFileName',
  [ResidueType.PAPER]: 'paperVideoFileName',
  [ResidueType.ORGANIC]: 'organicVideoFileName',
  [ResidueType.PLASTIC]: 'plasticVideoFileName',
};
