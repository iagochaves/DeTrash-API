export enum Role {
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';

export const PERMISSION_SCOPES = {
  [Role.Admin]: ['read:users'],
};
