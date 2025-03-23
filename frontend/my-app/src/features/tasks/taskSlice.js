import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Hadi li katkhalli l-redux slice ykhdm m3a async requests.
import axios from 'axios'; // Hadi bghit nimporti axios bash ndero l-requests l-API.

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (projectId, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState(); // Hna kanjibo auth men l-state bash nista3mlo l-token dyal user
    const response = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, { // Hadi li katdir request GET bash tjib l-tasks li mkhassrin l-project
      headers: { Authorization: `Bearer ${auth.token}` }, // Hna n3tiw l-token m3a l-header dyal request
    });
    return response.data; // Ila mchi kulchi mzian, dirna return l-data dyal tasks
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks'); // Ila kan chi error, dirna reject m3a message
  }
});

export const addTask = createAsyncThunk('tasks/addTask', async (task, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState(); // Nsame3u l-token dyal user mn l-state
    const response = await axios.post('http://localhost:5000/api/tasks', task, { // Hna kanzido task gdid
      headers: { Authorization: `Bearer ${auth.token}` }, // Ndiru l-header b l-token
    });
    return response.data; // Ila mchi kulchi mzian, nreturni l-data dyal task l-gdidi
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add task'); // Ila kanchi error, dirna reject m3a message
  }
});

export const editTask = createAsyncThunk('tasks/editTask', async ({ id, data }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState(); // Nsame3u l-token dyal user
    const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, data, { // Hna nbdlu task lli 3andna
      headers: { Authorization: `Bearer ${auth.token}` }, // L-token m3a header
    });
    return response.data; // Ila kulshi mziyan, nreturni task b data m3dla
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to edit task'); // Ila kayn error, rejecti m3a message
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState(); // Bghina l-token dyal user
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, { // Hna kan9tlo task
      headers: { Authorization: `Bearer ${auth.token}` }, // B7al ma kayn header m3a token
    });
    return id; // N3tiw l-ID dyal task li tmazlna
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task'); // Ila kanchi error, rejecti m3a message
  }
});

const taskSlice = createSlice({
  name: 'tasks', // L'ism dyal l-slice
  initialState: { tasks: [], loading: false, error: null }, // L-state dyal l-tasks, wa9ila kayn loading o error
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true; // Kayn wa9t li kayn loading
        state.error = null; // Hna n9awwdo error
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false; // Mlli ykml l-fetch, kaynsh loading
        state.tasks = action.payload; // L7ab n7ttou tasks jdod
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false; // Kayn rejected, n9awwdo loading
        state.error = action.payload; // T7attina error
      })
      // Add Task
      .addCase(addTask.pending, (state) => {
        state.loading = true; // Khlina loading mn b3d ma n3rfu chi user kaynchi
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false; // Mlli n3rfu blli n9admo task, n9awwdo loading
        state.tasks.push(action.payload); // Zidna task l-liste
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false; // L9ina error, kayn rejected
        state.error = action.payload; // Khznna message dyal error
      })
      // Edit Task
      .addCase(editTask.pending, (state) => {
        state.loading = true; // Kayn loading
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false; // L7it task m3doul, hadi ma fihach loading
        const index = state.tasks.findIndex((t) => t._id === action.payload._id); // Kan7ssbu index dyal task li bghina n3adlo
        if (index !== -1) state.tasks[index] = action.payload; // Ila l9ina task li m3doul, nbdlouh
      })
      .addCase(editTask.rejected, (state, action) => {
        state.loading = false; // Error m3a edit
        state.error = action.payload; // T7attina error
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true; // Mlli kayn delete, kayn loading
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false; // B3d ma nsahbu task, n9awdo loading
        state.tasks = state.tasks.filter((t) => t._id !== action.payload); // Nms7o task li id dyalo ma b9ash f liste
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false; // Kayn rejected
        state.error = action.payload; // Khznna error dyal delete
      });
  },
});

export default taskSlice.reducer; // F l-akhyr, nexportiw reducer dyal tasks
