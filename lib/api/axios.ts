import _axios from 'axios';

export const axios = _axios.create({
  baseURL: '/api/v1',
});
