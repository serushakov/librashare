import axios from 'axios';
import { apiUrl } from './constants';

export async function postLogin(username, password) {
  const url = apiUrl('/login');

  const response = await axios.post(url, {
    username,
    password,
  });

  return response;
}

export async function postRegister({ username, password, email, fullName }) {
  const url = apiUrl('/users');

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      email,
      full_name: fullName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}

export async function getCurrentUser(token) {
  const url = apiUrl('/users/user');

  const response = await fetch(url, {
    headers: {
      'x-access-token': token,
    },
  });

  return response;
}

export async function getUsernameExists(username) {
  const url = apiUrl(`/users/username/${username}`);

  const response = await fetch(url);

  return response.json();
}
