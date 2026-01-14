import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const initialState = {
  conversations: [],
  isLoading: false,
  error: null,
};

// Mock conversations pour les étudiants
const mockStudentConversations = [
  {
    id: 1,
    companyName: 'TechCorp',
    stageTitle: 'Stage Développeur Full Stack',
    lastMessage: 'Merci pour votre candidature !',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1,
    messages: [
      {
        text: 'Bonjour, j\'ai postulé pour votre offre de stage.',
        sender: 'student',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        text: 'Bonjour ! Merci pour votre candidature. Nous l\'avons bien reçue.',
        sender: 'company',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        text: 'Merci pour votre candidature !',
        sender: 'company',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    companyName: 'Digital Agency',
    stageTitle: 'Stage Marketing Digital',
    lastMessage: 'Quand êtes-vous disponible pour un entretien ?',
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        text: 'Bonjour, je suis intéressé par votre offre.',
        sender: 'student',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        text: 'Bonjour ! Votre profil nous intéresse. Quand êtes-vous disponible pour un entretien ?',
        sender: 'company',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  },
];

// Async thunks
export const fetchStudentMessages = createAsyncThunk(
  'messages/fetchStudentMessages',
  async (_, { rejectWithValue }) => {
    try {
      await simulateDelay();
      return mockStudentConversations;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de chargement des messages' });
    }
  }
);

export const sendMessageToCompany = createAsyncThunk(
  'messages/sendMessage',
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
      return rejectWithValue({ message: 'Erreur d\'envoi du message' });
    }
  }
);

export const startConversation = createAsyncThunk(
  'messages/startConversation',
  async ({ companyId, companyName, stageTitle, initialMessage }, { rejectWithValue }) => {
    try {
      await simulateDelay();
      const newConversation = {
        id: Date.now(),
        companyName,
        stageTitle,
        lastMessage: initialMessage,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        messages: [
          {
            text: initialMessage,
            sender: 'student',
            timestamp: new Date().toISOString(),
          },
        ],
      };
      return newConversation;
    } catch (error) {
      return rejectWithValue({ message: 'Erreur de création de conversation' });
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    markAsRead: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchStudentMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchStudentMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessageToCompany.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.messages.push(message);
          conversation.lastMessage = message.text;
          conversation.lastMessageAt = message.timestamp;
        }
      })
      // Start conversation
      .addCase(startConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
      });
  },
});

export const { clearError, markAsRead } = messagesSlice.actions;
export default messagesSlice.reducer;
