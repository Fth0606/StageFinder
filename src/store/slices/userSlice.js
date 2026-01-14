import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockUser, mockApplications } from '../../data/mockData';
import { setUser } from './authSlice';

const initialState = {
  profile: null,
  applications: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  isLoading: false,
  error: null,
};

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Async actions avec mock
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockUser;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement du profil' });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue, dispatch, getState }) => {
    try {
      await simulateDelay();
      
      // Récupérer l'utilisateur actuel depuis le state
      const currentUser = getState().auth.user;
      
      // Simule la mise à jour en gardant TOUTES les propriétés existantes
      const updatedProfile = { 
        ...currentUser,  // Garde toutes les propriétés (y compris role, id, etc.)
        ...profileData   // Écrase seulement ce qui est fourni
      };
      
      // Met à jour aussi dans authSlice pour garder la cohérence
      // IMPORTANT: On garde le role et autres propriétés critiques
      dispatch(setUser(updatedProfile));
      
      // Sauvegarde dans localStorage en gardant TOUTES les propriétés
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      
      console.log('✅ Profil mis à jour:', updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de mise à jour' });
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'user/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockApplications;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement des candidatures' });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('favorites');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = userSlice.actions;
export default userSlice.reducer;