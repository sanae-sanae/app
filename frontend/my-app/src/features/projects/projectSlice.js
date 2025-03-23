import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Hadi l-function li katsift l-request bach tji l-projects mn l-backend
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();  // ghir kanakhdu l'token mn state
    const response = await axios.get('http://localhost:5000/api/projects', {
      headers: { Authorization: `Bearer ${auth.token}` },  // kayn Authorization header li fih token
    });
    return response.data;  // kanrj3o l'projects li l'API raja3
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');  // ila kan chi error
  }
});

// Hadi katzid project jadid f l-backend
export const addProject = createAsyncThunk('projects/addProject', async (project, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();  // kayn tzid token m l state
    const response = await axios.post('http://localhost:5000/api/projects', project, {
      headers: { Authorization: `Bearer ${auth.token}` },  // katb3at Authorization header m3a token
    });
    return response.data;  // kanrj3o l-project li dza fi l-response
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add project');  // ila kan chi error
  }
});

// Hadi li katsayad l-project l'9dim bach t9der tchdil fih
export const editProject = createAsyncThunk('projects/editProject', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();  // kayn tzid token mn state
    const response = await axios.put(`http://localhost:5000/api/projects/${id}`, data, {
      headers: { Authorization: `Bearer ${auth.token}` },  // kayt9dam Authorization header m3a token
    });
    return response.data;  // kanrj3o l-project li tsayyed
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to edit project');  // ila kan chi error
  }
});

// Hadi li katsayad project bach tdeleteh mn l-backend
export const deleteProject = createAsyncThunk('projects/deleteProject', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();  // kayn tzid token mn state
    await axios.delete(`http://localhost:5000/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },  // Authorization header m3a token
    });
    return id;  // kanrj3o l'id d l-project li tdelete
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete project');  // ila kan chi error
  }
});

// Hadi l-slice li katsayad state dyal l-projects
const projectSlice = createSlice({
  name: 'projects',
  initialState: { projects: [], loading: false, error: null },  // hna kayn l'initial state
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;  // katbda loading f'9bal matji l'projects
        state.error = null;  // kaytmaso error ila kan
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;  // katbda loading
        state.projects = action.payload;  // kan7to l-projects li jat mn l'API
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;  // kat9a l'loading
        state.error = action.payload;  // kat7otto l'error li jat
      })
      // Add Project
      .addCase(addProject.pending, (state) => {
        state.loading = true;  // katbda loading f'9bal ma yji l-project li bghit tzid
        state.error = null;  // kaytmaso error ila kan
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;  // katbda loading
        state.projects.push(action.payload);  // katzido f projects l-jadida
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;  // kat9a l'loading
        state.error = action.payload;  // kat7otto l'error li jat
      })
      // Edit Project
      .addCase(editProject.pending, (state) => {
        state.loading = true;  // katbda loading f'9bal ma tsayad l-project li bghiti tbedel
        state.error = null;  // kaytmaso error ila kan
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.loading = false;  // katbda loading
        const index = state.projects.findIndex((p) => p._id === action.payload._id);  // katl9a project l'9dim li bghiti tbedel
        if (index !== -1) state.projects[index] = action.payload;  // kanbeddel l-project f l-array
      })
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;  // kat9a l'loading
        state.error = action.payload;  // kat7otto l'error li jat
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;  // katbda loading f'9bal ma yji tdelete l-project
        state.error = null;  // kaytmaso error ila kan
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;  // kat9a l'loading
        state.projects = state.projects.filter((p) => p._id !== action.payload);  // kat7e9 l-project mn l-array
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;  // kat9a l'loading
        state.error = action.payload;  // kat7otto l'error li jat
      });
  },
});

export default projectSlice.reducer;  // kanb3t l'project reducer
