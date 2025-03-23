import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Hadi ya mamii, hadchi kayjib lina l'projects mn API
export const fetchResources = createAsyncThunk('resources/fetchResources', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    // Hadi hadchi kaydir fetch l'API dyal resources
    const response = await axios.get('http://localhost:5000/api/resources', {
      headers: { Authorization: `Bearer ${auth.token}` }, // Hadi authorization header bash n9dru ndirou access
    });
    return response.data;
  } catch (error) {
    // F hadchi, ila kan chi error, ghadi yrja3 lina error message
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch resources');
  }
});

// Hadi hya l'methoda li kaddir add l'resource jdida
export const addResource = createAsyncThunk('resources/addResource', async (resource, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    // Kadir send l'API request b resource jdida
    const response = await axios.post('http://localhost:5000/api/resources', resource, {
      headers: { Authorization: `Bearer ${auth.token}` }, // Authorization li katkhdem l access
    });
    return response.data;
  } catch (error) {
    // F hadchi kan7awlo nrja3o error ila kayn
    return rejectWithValue(error.response?.data?.message || 'Failed to add resource');
  }
});

// Hadi kaydir tbdil f resource li kayna, yani kaymchi l API bash ydir update
export const editResource = createAsyncThunk('resources/editResource', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    // Hna update li f l'API li kaydir update l'resource li 3andna
    const response = await axios.put(`http://localhost:5000/api/resources/${id}`, data, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    // Ila kan chi error fi hadchi, ghadi y9dar l'error message
    return rejectWithValue(error.response?.data?.message || 'Failed to edit resource');
  }
});

// Hadi kaydir delete l'resource mn l'API, hna ydir delete 3la id
export const deleteResource = createAsyncThunk('resources/deleteResource', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    // Hna, kaydir request bach ydelete l'resource mn API
    await axios.delete(`http://localhost:5000/api/resources/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return id;
  } catch (error) {
    // F hadchi, ila ma khaddmch l'delete, ghadi nrja3 error
    return rejectWithValue(error.response?.data?.message || 'Failed to delete resource');
  }
});

// Hada li huwa l'slice dyal resource
const resourceSlice = createSlice({
  name: 'resources',
  initialState: { resources: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      // Hadi kaydir l'fetch dial resources
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hadi kaydir l'add li resource jdida
      .addCase(addResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addResource.fulfilled, (state, action) => {
        state.loading = false;
        state.resources.push(action.payload); // Nzeedou resource jdida l list
      })
      .addCase(addResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hadi kaydir l'edit f resource li kayna
      .addCase(editResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editResource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.resources.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.resources[index] = action.payload; // Kanbdlou l'machrou3 li howa modifié
      })
      .addCase(editResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hadi kaydir l'delete f resource
      .addCase(deleteResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = state.resources.filter((r) => r._id !== action.payload); // Kayhiyd l'resource mn list
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resourceSlice.reducer;
