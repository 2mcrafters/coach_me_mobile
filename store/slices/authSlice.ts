import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '../../types';
import axiosInstance from '../../services/axiosInstance';
import { Platform } from 'react-native';

// Helper functions for cross-platform storage
const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { user, access_token: token } = response.data;
      
      // Store user data and token
      await storage.setItem('userToken', token);
      await storage.setItem('userData', JSON.stringify(user));
      
      return { user, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Échec de connexion. Veuillez vérifier vos identifiants.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      // Convert genre to uppercase first letter to match Laravel format
      const formattedUserData = {
        ...userData,
        genre: userData.genre.charAt(0).toUpperCase() + userData.genre.slice(1),
        password: 'password', // Default password for testing
        email_verified_at: new Date().toISOString()
      };

      const response = await axiosInstance.post('/register', formattedUserData);
      const { user, access_token: token } = response.data;
      
      await storage.setItem('userToken', token);
      await storage.setItem('userData', JSON.stringify(user));
      
      return { user, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/logout');
      await storage.removeItem('userToken');
      await storage.removeItem('userData');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la déconnexion.');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getItem('userToken');
      const userData = await storage.getItem('userData');
      
      if (token && userData) {
        const response = await axiosInstance.get('/me');
        const user = response.data;
        
        // Update stored user data with latest from server
        await storage.setItem('userData', JSON.stringify(user));
        
        return { user, token };
      }
      return null;
    } catch (error) {
      // Clean up stored data on auth check failure
      await storage.removeItem('userToken');
      await storage.removeItem('userData');
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;