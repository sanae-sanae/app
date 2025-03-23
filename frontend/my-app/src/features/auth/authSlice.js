import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Hadi hiya l'API dialna, daba katchdmo m3a localhost
// Bghina diru l'authentification b'l'JWT f headers dialna
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Hadi hiya URL dial API dialna
});

// Daba kaynin interceptors li kaydiru li t7all l'Authorization f headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Katjib token li f localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`; // Ila kayn token katzido f headers
  return config;
});

// Hadi l'fonction dial login, m3a asynchrone bach n3rfu wach kayn chi erreur o la
export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    // Kanb3to l'username o password l'API
    const response = await api.post('/auth/login', { username, password });

    // Kayn chi token men l'API, katkhliih f localStorage
    localStorage.setItem('token', response.data.token);
    
    // Katchof f response u katrja3 l'object li fih token u user
    return { token: response.data.token, user: response.data.user };
  } catch (error) {
    // Ila kayn error, katrj3 message dial error
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// Hadi l'fonction dial register, kat3awd login bas 3la data dial user
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    // Katdir post bach tsajel user jdida
    const response = await api.post('/auth/register', userData);
    
    // Katkhli token dial l'API f localStorage
    localStorage.setItem('token', response.data.token);
    
    // Katchof l'response u katrja3 token o user
    return { token: response.data.token, user: response.data.user };
  } catch (error) {
    // Ila kan chi error kaykhdm error message
    return rejectWithValue(error.response?.data?.message || 'Register failed');
  }
});

// Hadi update dial profile user, kaydir PUT 3la server bash ybdel chi data
export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    // Katchdmo put request l'API bash tbdl data
    const response = await api.put('/auth/profile', profileData);
    
    // Katjib user li tbdlo
    return response.data.user; // F'backend kayrja3 user updated
  } catch (error) {
    // Ila kayn chi error, kayrja3 error message
    return rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

// Daba n9adro ndiro l'state dial Redux li kaymchi m3a login, register, update
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null, // Katjib token mn localStorage ila kayn
    user: null, // Kayn l'user idakhl l'app
    isAuthenticated: !!localStorage.getItem('token'), // Kayn l'token f localStorage, 7na authenticated wala la?
    loading: false, // L'état dial loading bach n3rfu wach khassna nsnaw
    error: null, // Ila kayn error n7ttoh hna
  },
  reducers: {
    logout: (state) => {
      // F'logout, kaymchi y7yydo token mn localStorage, u yreset kolchi
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Kaymchi kaydir update m3a login f l'état dial Redux
      .addCase(login.pending, (state) => {
        state.loading = true; // Kanbda n7ssbo chi wa9t
        state.error = null; // Kanhaydo l'erreur li 9bl
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false; // Kamlna, loading safi
        state.token = action.payload.token; // Kat3ti token
        state.user = action.payload.user; // Kat3ti user
        state.isAuthenticated = true; // Daba authenticated
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false; // Daba safi
        state.error = action.payload; // Kat3ti erreur li t7assalti
        state.isAuthenticated = false; // Ma3ndna9ach authentication
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload }; // Katjib data jdida o katsaybh m3a user li kayn
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Daba f akhir, katchof logout
export const { logout } = authSlice.actions;
export default authSlice.reducer;
