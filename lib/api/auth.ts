import {LoginInput} from '../validations/auth';
import {axios} from './axios';

async function logOut() {
  return axios.delete('/auth/log-out');
}

async function logIn(data: LoginInput) {
  const response = await axios.post('/auth/log-in', data);
  return response.data;
}

async function registerUser(data: LoginInput) {
  const response = await axios.post('/auth/register', data);
  return response.data;
}

export const authApi = {
  logOut,
  logIn,
  registerUser,
};
