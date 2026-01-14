import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const initialState = {
  stages: [],
  applications: [],
  conversations: [],
  stats: {
    totalStages: 0,
    totalApplications: 0,
    pendingApplications: 0,
    viewsThisMonth: 0,
  },
  isLoading: false,
  error: null,
};

// Mock data pour les stages de l'entreprise
const mockCompanyStages = [
  {
    id: 1,
    title: 'Stage Développeur Full Stack',
    location: 'Paris, France',
    status: 'active',
    applicationsCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Stage Marketing Digital',
    location: 'Lyon, France',
    status: 'active',
    applicationsCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Mock data pour les candidatures
const mockCompanyApplications = [
  {
    id: 1,
    candidateName: 'Marie Dubois',
    candidateEmail: 'marie.dubois@email.com',
    candidatePhone: '06 12 34 56 78',
    candidateEducation: 'Master 2 Informatique',
    candidateSkills: ['React', 'Node.js', 'MongoDB'],
    stageTitle: 'Stage Développeur Full Stack',
    stageLocation: 'Paris',
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'pending',
    coverLetter: 'Je suis très motivée par cette opportunité...',
  },
  {
    id: 2,
    candidateName: 'Thomas Martin',
    candidateEmail: 'thomas.martin@email.com',
    candidatePhone: '06 98 76 54 32',
    candidateEducation: 'Licence 3 Marketing',
    candidateSkills: ['SEO', 'Social Media', 'Analytics'],
    stageTitle: 'Stage Marketing Digital',
    stageLocation: 'Lyon',
    appliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'pending',
    coverLetter: 'Passionné par le marketing digital...',
  },
  {
    id: 3,
    candidateName: 'Sophie Bernard',
    candidateEmail: 'sophie.bernard@email.com',
    candidatePhone: '06 55 44 33 22',
    candidateEducation: 'Master 1 Informatique',
    candidateSkills: ['JavaScript', 'Vue.js', 'Python'],
    stageTitle: 'Stage Développeur Full Stack',
    stageLocation: 'Paris',
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'accepted',
    coverLetter: 'Mon expérience en développement web...',
  },
];

// Mock conversations
const mockConversations = [
  {
    id: 1,
    candidateName: 'Marie Dubois',
    stageTitle: 'Stage Développeur Full Stack',
    lastMessage: 'Merci pour votre réponse rapide !',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 2,
    messages: [
      {
        text: 'Bonjour, j\'aimerais avoir plus d\'informations sur le stage.',
        sender: 'candidate',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        text: 'Bonjour Marie, avec plaisir ! Que souhaitez-vous savoir ?',
        sender: 'company',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        text: 'Merci pour votre réponse rapide !',
        sender: 'candidate',
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

// Async thunks
export const fetchCompanyStages = createAsyncThunk(
  'company/fetchStages',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockCompanyStages;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const fetchCompanyApplications = createAsyncThunk(
  'company/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockCompanyApplications;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const createStage = createAsyncThunk(
  'company/createStage',
  async (stageData, { rejectWithValue }) => {
    try {
      await simulateDelay(1000);
      const newStage = {
        ...stageData,
        id: Date.now(),
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
      };
      return newStage;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de création' });
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'company/updateApplicationStatus',
  async ({ applicationId, status, reason }, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return { applicationId, status, reason };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de mise à jour' });
    }
  }
);

export const fetchCompanyMessages = createAsyncThunk(
  'company/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockConversations;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement' });
    }
  }
);

export const sendMessage = createAsyncThunk(
  'company/sendMessage',
  async ({ conversationId, message, sender }, { rejectWithValue }) => {
    try {
      await simulateDelay(300);
      return {
        conversationId,
        message: {
          text: message,
          sender,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return rejectWithValue({ message: 'Erreur d\'envoi' });
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stages
      .addCase(fetchCompanyStages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanyStages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages = action.payload;
        state.stats.totalStages = action.payload.length;
      })
      .addCase(fetchCompanyStages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch applications
      .addCase(fetchCompanyApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
        state.stats.totalApplications = action.payload.length;
        state.stats.pendingApplications = action.payload.filter(a => a.status === 'pending').length;
      })
      // Create stage
      .addCase(createStage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stages.unshift(action.payload);
        state.stats.totalStages += 1;
      })
      .addCase(createStage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { applicationId, status } = action.payload;
        const application = state.applications.find(a => a.id === applicationId);
        if (application) {
          application.status = status;
          state.stats.pendingApplications = state.applications.filter(a => a.status === 'pending').length;
        }
      })
      // Fetch messages
      .addCase(fetchCompanyMessages.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.messages.push(message);
          conversation.lastMessage = message.text;
          conversation.lastMessageAt = message.timestamp;
        }
      });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;
