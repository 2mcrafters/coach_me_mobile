import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { User } from '@/types';

interface UserState {
  profile: any | null;
  coaches: User[];
  selectedCoach: User | null;
  isLoading: boolean;
  error: string | null;
}

// Test data for coaches
const testCoaches: User[] = [
  {
    id: 1,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@example.com',
    dateNaissance: '1985-06-15',
    telephone: '+33612345678',
    adresse: 'Paris, France',
    genre: 'femme',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    statut: 'Actif',
    situation_familliale: 'marié(e)',
    role: 'coach',
    specialites: ['Développement personnel', 'Gestion du stress'],
    rating: 4.8,
    coursCount: 12,
    bio: 'Coach certifiée avec plus de 10 ans d\'expérience dans l\'accompagnement personnel et professionnel.'
  },
  {
    id: 2,
    nom: 'Dubois',
    prenom: 'Thomas',
    email: 'thomas.dubois@example.com',
    dateNaissance: '1990-03-22',
    telephone: '+33623456789',
    adresse: 'Lyon, France',
    genre: 'homme',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    statut: 'Actif',
    situation_familliale: 'célibataire',
    role: 'coach',
    specialites: ['Leadership', 'Communication'],
    rating: 4.9,
    coursCount: 8,
    bio: 'Spécialiste en développement du leadership et communication interpersonnelle.'
  },
  {
    id: 3,
    nom: 'Garcia',
    prenom: 'Marie',
    email: 'marie.garcia@example.com',
    dateNaissance: '1988-09-10',
    telephone: '+33634567890',
    adresse: 'Marseille, France',
    genre: 'femme',
    photo: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg',
    statut: 'Actif',
    situation_familliale: 'célibataire',
    role: 'coach',
    specialites: ['Bien-être', 'Mindfulness'],
    rating: 4.7,
    coursCount: 15,
    bio: 'Passionnée par le bien-être holistique et le développement personnel.'
  }
];

const initialState: UserState = {
  profile: null,
  coaches: testCoaches,
  selectedCoach: null,
  isLoading: false,
  error: null
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }
);

export const fetchCoaches = createAsyncThunk(
  'user/fetchCoaches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/coaches');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des coachs');
    }
  }
);

export const fetchCoachById = createAsyncThunk(
  'user/fetchCoachById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/coaches/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du coach');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearSelectedCoach: (state) => {
      state.selectedCoach = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile fetching
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Coaches fetching
      .addCase(fetchCoaches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoaches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coaches = action.payload;
        state.error = null;
      })
      .addCase(fetchCoaches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Single coach fetching
      .addCase(fetchCoachById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoachById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCoach = action.payload;
        state.error = null;
      })
      .addCase(fetchCoachById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCoach } = userSlice.actions;
export default userSlice.reducer;