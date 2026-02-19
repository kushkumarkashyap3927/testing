import axios from 'axios';
import {toast} from 'sonner';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${backendUrl}/api/v1`, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Global response interceptor: show a toast for network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network / CORS / server down
      toast.error('Network error. Please check your connection or backend server.');
    }
    return Promise.reject(error);
  }
);

const _extractMessage = (resp) => {
  if (!resp) return null;
  if (resp.data && typeof resp.data === 'object' && 'message' in resp.data) return resp.data.message;
  if (typeof resp === 'object' && 'message' in resp) return resp.message;
  return null;
};


/*

all methods of user

post /users - create user
post /users/login - login user
get /users - get all users
delete /users/:id - delete a specific user
delete /users - delete all users


 */

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    const msg = _extractMessage(response) || "User created successfully";
    toast.success(msg);
    return response.data ?? response;
  } catch (error) {
    console.error('Error creating user:', error);
    const errMsg = error?.response ? (error.response.data?.message ?? error.response.message) : "Failed to create user";
    toast.error(errMsg);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const msg = _extractMessage(response) || "Login successful";
    toast.success(msg);
    return response.data ?? response;
  } catch (error) {
    console.error('Error logging in:', error);
    const errMsg = error?.response ? (error.response.data?.message ?? error.response.message) : "Failed to login";
    toast.error(errMsg);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    const msg = _extractMessage(response) || "Users fetched successfully";
    toast.success(msg);
    return response.data ?? response;
  } catch (error) {
    console.error('Error fetching users:', error);
    const errMsg = error?.response ? (error.response.data?.message ?? error.response.message) : "Failed to fetch users";
    toast.error(errMsg);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    const msg = _extractMessage(response) || "User deleted successfully";
    toast.success(msg);
    return response.data ?? response;
  } catch (error) {
    console.error('Error deleting user:', error);
    const errMsg = error?.response ? (error.response.data?.message ?? error.response.message) : "Failed to delete user";
    toast.error(errMsg);
    throw error;
  }
};

export const deleteAllUsers = async () => {
  try {
    const response = await api.delete('/users');
    const msg = _extractMessage(response) || "All users deleted successfully";
    toast.success(msg);
    return response.data ?? response;
  } catch (error) {
    console.error('Error deleting all users:', error);
    const errMsg = error?.response ? (error.response.data?.message ?? error.response.message) : "Failed to delete all users";
    toast.error(errMsg);
    throw error;
  }
};


