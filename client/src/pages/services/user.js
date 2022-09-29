import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";
const axs = axios.create({
  baseURL: API_URL,
});

const getUsers =
  (page = 1) =>
  () => {
    return axs.get(`/user?page=${page}`);
  };

const createNewUser = (user) => {
  return axs.post(`/user`, user);
};
const updateUser = ({ id, user }) => {
  return axs.put(`/user/${id}`, user);
};

export { getUsers, createNewUser, updateUser };
