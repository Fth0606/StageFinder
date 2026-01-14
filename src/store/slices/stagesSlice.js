
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Importer les données mock
import { mockStages } from '../../data/mockData';

const initialState = {
  stages: [],
  currentStage: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    location: '',
    domain: '',
    duration: '',
    type: '',
  },
};

// ===== SIMULATION D'API AVEC DONNÉES MOCK =====

// Fonction helper pour simuler un délai réseau
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Async actions avec données mock
export const fetchStages = createAsyncThunk(
  'stages/fetchStages',
  async (filters, { rejectWithValue }) => {
    try {
      await simulateDelay(); // Simule un appel API
      
      let filteredStages = [...mockStages];
      
      // Appliquer les filtres
      if (filters) {
        if (filters.search) {
          filteredStages = filteredStages.filter(stage => 
            stage.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            stage.company.toLowerCase().includes(filters.search.toLowerCase()) ||
            stage.description.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.location) {
          filteredStages = filteredStages.filter(stage =>
            stage.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        
        if (filters.domain) {
          filteredStages = filteredStages.filter(stage =>
            stage.tags.some(tag => tag.toLowerCase().includes(filters.domain.toLowerCase()))
          );
        }
        
        if (filters.limit) {
          filteredStages = filteredStages.slice(0, filters.limit);
        }
      }
      
      return filteredStages;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur lors du chargement des stages' });
    }
  }
);

export const fetchStageById = createAsyncThunk(
  'stages/fetchStageById',
  async (id, { rejectWithValue }) => {
    try {
      await simulateDelay();
      
      const stage = mockStages.find(s => s.id === parseInt(id));
      
      if (!stage) {
        return rejectWithValue({ message: 'Stage non trouvé' });
      }
      
      return stage;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur lors du chargement du stage' });
    }
  }
);

export const applyToStage = createAsyncThunk(
  'stages/applyToStage',
  async ({ stageId, applicationData }, { rejectWithValue }) => {
    try {
      await simulateDelay(1000);
      
      // Simule un succès
      console.log('Candidature envoyée:', { stageId, applicationData });
      
      return {
        success: true,
        message: 'Candidature envoyée avec succès',
        applicationId: Date.now(),
      };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur lors de l\'envoi de la candidature' });
    }
  }
);

const stagesSlice = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentStage: (state) => {
      state.currentStage = null;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        location: '',
        domain: '',
        duration: '',
        type: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stages
      .addCase(fetchStages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages = action.payload;
      })
      .addCase(fetchStages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch stage by ID
      .addCase(fetchStageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStage = action.payload;
      })
      .addCase(fetchStageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Apply to stage
      .addCase(applyToStage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyToStage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(applyToStage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentStage, clearFilters } = stagesSlice.actions;
export default stagesSlice.reducer;
