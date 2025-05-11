import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.0.144:8001/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Platform-specific storage implementation
const storage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  }
};

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('Requête envoyée:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    
    const token = await storage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur lors de la requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour logger les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erreur de réponse:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;