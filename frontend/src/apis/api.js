import axios from 'axios';
import {toast} from 'sonner';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


