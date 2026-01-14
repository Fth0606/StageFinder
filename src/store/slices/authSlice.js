import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockUser } from '../../data/mockData';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Async actions avec détection admin
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await simulateDelay();
      
      if (!email || !password) {
        return rejectWithValue({ message: 'Email et mot de passe requis' });
      }

      // ✅ DÉTECTION AUTOMATIQUE DU RÔLE ADMIN
      let userType = 'student'; // Par défaut
      
      // Si le mot de passe est "adminadmin", c'est un admin
      if (password === 'adminadmin') {
        userType = 'admin';
      }
      // Si l'email contient "company" ou le mot de passe est "company123", c'est une entreprise
      else if (email.includes('company') || password === 'company123') {
        userType = 'company';
      }
      
      const token = 'mock-jwt-token-' + Date.now();
      const user = { 
        ...mockUser, 
        email,
        userType // ✅ Type déterminé selon le mot de passe
      };
      
      console.log('✅ Connexion réussie avec le rôle:', userType);
      
      return { user, token };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de connexion' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      await simulateDelay();
      
      if (!userData.email || !userData.password || !userData.name) {
        return rejectWithValue({ message: 'Tous les champs sont requis' });
      }
      
      if (userData.password.length < 6) {
        return rejectWithValue({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
      }
      
      const token = 'mock-jwt-token-' + Date.now();
      const user = {
        ...mockUser,
        name: userData.name,
        email: userData.email,
        userType: userData.userType || 'student',
      };
      
      return { user, token };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur lors de l\'inscription' });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await simulateDelay(200);
  return null;
});

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue({ message: 'Non authentifié' });
      }
      
      await simulateDelay();
      return mockUser;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
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
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      // Load user
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;