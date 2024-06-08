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

export const ERR_MSG = {
  USER: {
    NOT_FOUND: 'Пользователь не найден',
    AUTH_PROBLEM: 'Неправильное имя пользователя или пароль',
  },
  OFFER: {
    NOT_FOUND_WISH: 'Нельзя поддержать то, чего нет',
    SELF_SUPPORT: 'Нельзя самоподдержаться, иначе смысл',
    TOO_MUCH: 'Вы очень щедрый человек, но этого многовато',
    COLLECTED: 'Необходимая сумма уже собрана',
    NOT_FOUND: 'Донат не найден',
  },
  WISH: {
    NOT_FOUND: 'Такого желания у нас нет :( Но вы можете его создать! ;)',
    FORBIDDEN_CHANGE: 'Это не ваше желание, так что и менять его нельзя',
    FORBIDDEN_RAISED:
      'Это желание поменять не получится, так как кто-то уже решил его поддержать',
    FORBIDDEN_DELETE: 'Это не ваше желание, так что и удалить его нельзя',
    ALREADY_COPIED: 'Вы уже скопировали данное желание',
  },
  WISHLIST: {
    NOT_FOUND_MANY: 'Подборки желаний не найдены',
    NOT_FOUND_ONE: 'Подборка не найдена',
    NOT_EMPTY: 'В подборке должно быть хотя бы одно желание',
    FORBIDDEN_CHANGE: 'Это не ваша подборка, так что и менять её нельзя',
    FORBIDDEN_DELETE: 'Это не ваша подборка, так что и удалить её нельзя',
  },
};
