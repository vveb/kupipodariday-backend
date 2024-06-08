export const defineErrMessageConflictUsers = (
  isEmail: boolean,
  isUsername: boolean,
) => {
  if (isUsername && isEmail) {
    return 'Пользователь(и) с такими именем и email уже существует';
  } else if (isEmail) {
    return 'Пользователь с таким email уже существует';
  } else if (isUsername) {
    return 'Пользователь с таким именем уже существует';
  }
};
