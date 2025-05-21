```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Fetch all sessions for the authenticated user
export const fetchSessions = createAsyncThunk(
  'sessions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/zoom/meetings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

// Create a new session
export const createSession = createAsyncThunk(
  'sessions/create',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/zoom/meetings', {
        topic: sessionData.topic,
        start_time: sessionData.start_time,
        duration: sessionData.duration,
        guest_id: sessionData.guest_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

// Join an existing session
export const joinSession = createAsyncThunk(
  'sessions/join',
  async (meetingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/zoom/meetings/${meetingId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join session');
    }
  }
);

// Get Zoom JWT token
export const getZoomToken = createAsyncThunk(
  'sessions/getZoomToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/zoom/token');
      return response.data.token;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get Zoom token');
    }
  }
);

const sessionSlice = createSlice({
  name: 'sessions',
  initialState: {
    sessions: [],
    currentSession: null,
    loading: false,
    error: null,
    zoomToken: null,
  },
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    setZoomToken: (state, action) => {
      state.zoomToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Session
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.push(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join Session
      .addCase(joinSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
      })
      .addCase(joinSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Zoom Token
      .addCase(getZoomToken.fulfilled, (state, action) => {
        state.zoomToken = action.payload;
      });
  },
});

export const { clearSessionError, setZoomToken } = sessionSlice.actions;
export default sessionSlice.reducer;
```