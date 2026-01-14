import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const initialState = {
  users: [],
  stages: [],
  companies: [],
  stats: {
    totalUsers: 0,
    totalStages: 0,
    totalCompanies: 0,
    totalApplications: 0,
    newUsersThisMonth: 0,
    activeStages: 0,
    activeCompanies: 0,
    applicationsToday: 0,
    studentCount: 0,
    companyCount: 0,
  },
  recentActivities: [],
  isLoading: false,
  error: null,
};

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    userType: 'student',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 2,
    name: 'TechCorp',
    email: 'contact@techcorp.fr',
    userType: 'company',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 3,
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    userType: 'student',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

const mockAdminStages = [
  {
    id: 1,
    title: 'Stage Développeur Full Stack',
    company: 'TechCorp',
    location: 'Paris, France',
    duration: '6 mois',
    status: 'active',
    applicationsCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    tags: ['React', 'Node.js'],
    description: 'Développement d\'applications web...',
  },
  {
    id: 2,
    title: 'Stage Marketing Digital',
    company: 'Digital Agency',
    location: 'Lyon, France',
    duration: '4 mois',
    status: 'pending',
    applicationsCount: 5,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['SEO', 'Social Media'],
    description: 'Gestion des réseaux sociaux...',
  },
];

const mockCompanies = [
  {
    id: 1,
    name: 'TechCorp',
    location: 'Paris, France',
    sectors: ['Tech', 'Web'],
    employeesCount: '50-100',
    stagesCount: 3,
    applicationsCount: 25,
    status: 'verified',
    email: 'contact@techcorp.fr',
    phone: '01 23 45 67 89',
    website: 'https://techcorp.fr',
    description: 'Startup innovante...',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
  {
    id: 2,
    name: 'Digital Agency',
    location: 'Lyon, France',
    sectors: ['Marketing', 'Digital'],
    employeesCount: '20-50',
    stagesCount: 2,
    applicationsCount: 15,
    status: 'pending',
    email: 'contact@digitalagency.fr',
    phone: '04 12 34 56 78',
    website: 'https://digitalagency.fr',
    description: 'Agence digitale...',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

const mockActivities = [
  {
    type: 'user',
    message: 'Nouvel utilisateur inscrit: Marie Martin',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    type: 'stage',
    message: 'Nouvelle offre publiée: Stage Marketing Digital',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    type: 'application',
    message: '5 nouvelles candidatures aujourd\'hui',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];

// Async thunks
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return {
        totalUsers: 150,
        totalStages: 95,
        totalCompanies: 35,
        totalApplications: 412,
        newUsersThisMonth: 12,
        activeStages: 78,
        activeCompanies: 28,
        applicationsToday: 8,
        studentCount: 120,
        companyCount: 30,
      };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockUsers;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const fetchAllStages = createAsyncThunk(
  'admin/fetchStages',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockAdminStages;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const fetchAllCompanies = createAsyncThunk(
  'admin/fetchCompanies',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockCompanies;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return { userId, status };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de mise à jour' });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return userId;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de suppression' });
    }
  }
);

export const updateStageStatus = createAsyncThunk(
  'admin/updateStageStatus',
  async ({ stageId, status }, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return { stageId, status };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de mise à jour' });
    }
  }
);

export const deleteStage = createAsyncThunk(
  'admin/deleteStage',
  async (stageId, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return stageId;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de suppression' });
    }
  }
);

export const verifyCompany = createAsyncThunk(
  'admin/verifyCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return companyId;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de vérification' });
    }
  }
);

export const suspendCompany = createAsyncThunk(
  'admin/suspendCompany',
  async (companyId, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return companyId;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de suspension' });
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.recentActivities = mockActivities;
      })
      // Fetch users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const user = state.users.find(u => u.id === userId);
        if (user) user.status = status;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      // Fetch stages
      .addCase(fetchAllStages.fulfilled, (state, action) => {
        state.stages = action.payload;
      })
      // Update stage status
      .addCase(updateStageStatus.fulfilled, (state, action) => {
        const { stageId, status } = action.payload;
        const stage = state.stages.find(s => s.id === stageId);
        if (stage) stage.status = status;
      })
      // Delete stage
      .addCase(deleteStage.fulfilled, (state, action) => {
        state.stages = state.stages.filter(s => s.id !== action.payload);
      })
      // Fetch companies
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
      })
      // Verify company
      .addCase(verifyCompany.fulfilled, (state, action) => {
        const company = state.companies.find(c => c.id === action.payload);
        if (company) company.status = 'verified';
      })
      // Suspend company
      .addCase(suspendCompany.fulfilled, (state, action) => {
        const company = state.companies.find(c => c.id === action.payload);
        if (company) company.status = 'suspended';
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;