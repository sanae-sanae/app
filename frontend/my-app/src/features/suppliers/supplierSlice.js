import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Hna, bnt zina, kan-importiw tools mn Redux Toolkit w axios bash n-siftu requests l l-backend.

// Hadi function li kat-jibi l-suppliers mn l-backend.
export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState(); // Kan-jibiw l-token mn l-state.
    const response = await axios.get('http://localhost:5000/api/suppliers', {
      headers: { Authorization: `Bearer ${auth.token}` }, // Kan-siftu l-request b l-token.
    });
    return response.data; // Kan-rj3u l-suppliers li jab l-backend.
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers'); // Ila fshl, kan-rj3u l-error.
  }
});

// Hadi kat-zid supplier jdid.
export const addSupplier = createAsyncThunk('suppliers/addSupplier', async (supplier, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.post('http://localhost:5000/api/suppliers', supplier, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data; // Kan-rj3u l-supplier l-jdid.
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add supplier');
  }
});

// Hadi kat-updati supplier.
export const editSupplier = createAsyncThunk('suppliers/editSupplier', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.put(`http://localhost:5000/api/suppliers/${id}`, data, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data; // Kan-rj3u l-supplier l-mjddad.
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to edit supplier');
  }
});

// Hadi kat-deleti supplier.
export const deleteSupplier = createAsyncThunk('suppliers/deleteSupplier', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return id; // Kan-rj3u l-ID bash n-updatiw l-state.
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete supplier');
  }
});

// Hna l-slice li kat-handli l-state dial suppliers.
const supplierSlice = createSlice({
  name: 'suppliers',
  initialState: { suppliers: [], loading: false, error: null }, // L-state l-awwali: lista khawya, loading false, w error null.
  extraReducers: (builder) => {
    builder
      // Fetch Suppliers
      .addCase(fetchSuppliers.pending, (state) => { state.loading = true; state.error = null; }) // Kan-bdiw loading w kan-n9iw l-error.
      .addCase(fetchSuppliers.fulfilled, (state, action) => { state.loading = false; state.suppliers = action.payload; }) // Kan-salaw loading w kan-7tu l-suppliers.
      .addCase(fetchSuppliers.rejected, (state, action) => { state.loading = false; state.error = action.payload; }) // Ila fshl, kan-7tu l-error.
      // Add Supplier
      .addCase(addSupplier.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addSupplier.fulfilled, (state, action) => { state.loading = false; state.suppliers.push(action.payload); }) // Kan-zidu l-supplier l-jdid l l-lista.
      .addCase(addSupplier.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Edit Supplier
      .addCase(editSupplier.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(editSupplier.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.suppliers.findIndex((s) => s._id === action.payload._id); 
        if (index !== -1) state.suppliers[index] = action.payload; // Kan-updatiw l-supplier f l-lista.
      })
      .addCase(editSupplier.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Delete Supplier
      .addCase(deleteSupplier.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteSupplier.fulfilled, (state, action) => { 
        state.loading = false; 
        state.suppliers = state.suppliers.filter((s) => s._id !== action.payload); // Kan-hiddu l-supplier mn l-lista.
      })
      .addCase(deleteSupplier.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default supplierSlice.reducer; // Kan-exportiw l-reducer bash nsta3mlouh f l-store.