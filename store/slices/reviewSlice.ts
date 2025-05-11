import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewState, Review } from '@/types';
import axiosInstance from '@/services/axiosInstance';

const testReviews: Review[] = [
  {
    id: 1,
    coach_id: 1,
    user_id: 2,
    rating: 5,
    description: "Excellent coach ! Les séances sont très enrichissantes et personnalisées.",
    created_at: '2024-02-20T10:00:00.000Z',
    updated_at: '2024-02-20T10:00:00.000Z',
    user: {
      id: 2,
      nom: 'Dubois',
      prenom: 'Marie',
      email: 'marie.dubois@example.com',
      dateNaissance: '1992-05-15',
      telephone: '+33612345678',
      adresse: 'Paris',
      genre: 'femme',
      photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      statut: 'Actif',
      situation_familliale: 'célibataire',
      role: 'coache'
    }
  },
  {
    id: 2,
    coach_id: 1,
    user_id: 3,
    rating: 4,
    description: "Très professionnel et à l'écoute. Je recommande !",
    created_at: '2024-02-19T15:30:00.000Z',
    updated_at: '2024-02-19T15:30:00.000Z',
    user: {
      id: 3,
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@example.com',
      dateNaissance: '1988-09-20',
      telephone: '+33623456789',
      adresse: 'Lyon',
      genre: 'homme',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      statut: 'Actif',
      situation_familliale: 'marié(e)',
      role: 'coache'
    }
  }
];

const initialState: ReviewState = {
  reviews: testReviews,
  isLoading: false,
  error: null
};

export const fetchReviewsByCoachId = createAsyncThunk(
  'reviews/fetchByCoachId',
  async (coachId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/coaches/${coachId}/reviews`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des avis');
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async (reviewData: { coach_id: number; rating: number; description: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/coaches/${reviewData.coach_id}/reviews`, reviewData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avis');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByCoachId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByCoachId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByCoachId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewSlice.reducer;