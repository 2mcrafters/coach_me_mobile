import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ressourceReducer from './slices/ressourceSlice';
import planReducer from './slices/planSlice';
import sessionReducer from './slices/sessionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ressources: ressourceReducer,
    plans: planReducer,
    sessions: sessionReducer,
  },
});

export default store;