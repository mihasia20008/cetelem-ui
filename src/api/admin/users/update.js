import axios from 'axios';

async function updateUser(id, form) {
  try {
    const { data } = await axios({
      method: 'PATCH',
      url: `/api/v1/admin/users/${id}`,
      data: form
    });

    return {
      data,
      error: null,
    };
  } catch (err) {
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

export default updateUser;
