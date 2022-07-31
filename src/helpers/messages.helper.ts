const usersMessages = {
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  USER_NOT_RECYCLER: 'User is not a Recycler',
};

const formMessages = {
  FORM_NOT_FOUND: 'Form not found',
  FORM_DOES_NOT_HAVE_VIDEO: 'Form does not provides a video',
};

const fileMessages = {
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_NAME_COULD_NOT_BE_CREATED: 'File name could not be created',
};

export const MessagesHelper = {
  ...usersMessages,
  ...formMessages,
  ...fileMessages,
};
