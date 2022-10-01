export enum Role {
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';

export const PERMISSION_SCOPES = {
  [Role.Admin]: ['read:users'],
};

export const ALLOWED_MIMES = ['video/mp4', 'video/webm'];
