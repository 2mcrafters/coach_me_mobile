import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ResourceState, Resource } from '@/types';
import axiosInstance from '@/services/axiosInstance';

// Initial test data
const testResources: Resource[] = [
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
  },
  {
    id: 2,
    titre: 'Méditation guidée pour débutants',
    type: 'audio',
    url: 'https://example.com/meditation.mp3',
    estPremium: false,
    is_individual: true,
    prix: null,
    photo: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    created_at: '2024-02-20T10:00:00.000Z',
    updated_at: '2024-02-20T10:00:00.000Z'
  },
  {
    id: 3,
    titre: 'Masterclass: Atteindre ses objectifs',
    type: 'video',
    url: 'https://example.com/masterclass.mp4',
    estPremium: true,
    is_individual: false,
    prix: 49.99,
    photo: 'https://images.pexels.com/photos/7433809/pexels-photo-7433809.jpeg',
    created_at: '2024-02-20T10:00:00.000Z',
    updated_at: '2024-02-20T10:00:00.000Z'
  }
];

const initialState: ResourceState = {
  resources: testResources,
  selectedResource: null,
  isLoading: false,
  error: null
};

export const fetchResources = createAsyncThunk(
  'resources/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/resources');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des ressources');
    }
  }
);

export const fetchResourceById = createAsyncThunk(
  'resources/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/resources/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de la ressource');
    }
  }
);

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    clearSelectedResource: (state) => {
      state.selectedResource = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchResourceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedResource = action.payload;
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedResource } = resourceSlice.actions;
export default resourceSlice.reducer;