import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanState, Plan } from '@/types';
import axiosInstance from '@/services/axiosInstance';

// Initial test data
const testPlans: Plan[] = [
  {
    id: 1,
    titre: 'Plan Développement Personnel',
    description: 'Un programme complet pour votre développement personnel',
    prix: 299.99,
    duree: 12,
    categorie_id: 1,
    ressources: [
      {
        id: 1,
        titre: 'Guide du développement personnel',
        type: 'pdf',
        url: 'https://example.com/guide.pdf',
        estPremium: true,
        is_individual: true,
        prix: 29.99,
        photo: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg',
        created_at: '2024-02-20T10:00:00.000Z',
        updated_at: '2024-02-20T10:00:00.000Z'
      }
    ],
    created_at: '2024-02-20T10:00:00.000Z',
    updated_at: '2024-02-20T10:00:00.000Z'
  },
  {
    id: 2,
    titre: 'Programme Mindfulness',
    description: 'Apprenez à vivre dans le moment présent',
    prix: 199.99,
    duree: 8,
    categorie_id: 2,
    created_at: '2024-02-20T10:00:00.000Z',
    updated_at: '2024-02-20T10:00:00.000Z'
  }
];

const initialState: PlanState = {
  plans: testPlans,
  selectedPlan: null,
  isLoading: false,
  error: null
};

export const fetchPlans = createAsyncThunk(
  'plans/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/plans');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des plans');
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/plans/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du plan');
    }
  }
);

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPlanById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedPlan } = planSlice.actions;
export default planSlice.reducer;