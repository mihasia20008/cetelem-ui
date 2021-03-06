import axios from 'axios';

import { NOT_AUTHORISED } from '../response';

async function loginRequest(auth) {
  try {
    const { data } = await axios({
      method: 'POST',
      url: '/api/v1/session',
      data: auth,
    });

    return {
      data,
      error: null,
    };
  } catch (err) {
    if (err.response.status === NOT_AUTHORISED) {
      return {
        data: null,
        error: {
          status: NOT_AUTHORISED,
          message: 'Неверный логин или пароль',
        },
      };
    }

    // eslint-disable-next-line no-console
    console.log(err);
    return {
      data: null,
      error: {
        status: err.response.status,
        message: err.message,
      },
    };
  }
}

export default loginRequest;
