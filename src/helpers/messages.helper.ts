const usersMessages = {
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  USER_DOES_NOT_HAS_PERMISSION_TO_UPLOAD:
    'User do not have permission to submit files',
};

const formMessages = {
  FORM_NOT_FOUND: 'Form not found',
};

const documentMessages = {
  DOCUMENT_NOT_FOUND: 'Document not found',
};

const fileMessages = {
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_NAME_COULD_NOT_BE_CREATED: 'File name could not be created',
};

export const MessagesHelper = {
  ...usersMessages,
  ...formMessages,
  ...fileMessages,
  ...documentMessages,
};
