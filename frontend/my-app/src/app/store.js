
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import taskReducer from '../features/tasks/taskSlice';
import resourceReducer from '../features/resources/resourceSlice';
import supplierReducer from '../features/suppliers/supplierSlice';
export default configureStore({
  reducer: {
    auth: authReducer,       
    projects: projectReducer,
    tasks: taskReducer,
    resources: resourceReducer,
    suppliers: supplierReducer,
  },
});
