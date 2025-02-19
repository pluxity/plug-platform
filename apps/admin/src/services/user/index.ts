import { api, ResponseBody } from "../api";
import { User, CreateUserRequest, UpdateUserRequest } from "./types";

const USER_BASE_URL = "/users";

const userApi = {
  getUser: async (id: number): Promise<ResponseBody<User>> => {
    return await api.get<User>(`${USER_BASE_URL}/${id}`, { requireAuth: true });
  },

  getUsers: async (): Promise<ResponseBody<User[]>> => {
    return await api.get<User[]>(`${USER_BASE_URL}`, { requireAuth: true });
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    return await api.post<User>(`${USER_BASE_URL}`, data, {
      requireAuth: true,
    });
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    return await api.put<User>(`${USER_BASE_URL}/${id}`, data, {
      requireAuth: true,
    });
  },

  deleteUser: async (id: number): Promise<null> => {
    return await api.delete<null>(`${USER_BASE_URL}/${id}`, {
      requireAuth: true,
    });
  },
};

export default userApi;
