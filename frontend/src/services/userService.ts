import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  empresa: {
    id: string;
    name: string;
  };
}

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
}; 