import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTasks, addTask, editTask, deleteTask } from '../features/tasks/taskSlice';
import { fetchProjects } from '../features/projects/projectSlice';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function TaskList() {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { tasks, loading: tasksLoading, error: tasksError } = useAppSelector((state) => state.tasks);
  const { projects, loading: projectsLoading } = useAppSelector((state) => state.projects);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    dispatch(fetchProjects()).unwrap().catch((err) => toast.error('Failed to fetch projects: ' + err));
    if (projectId) {
      dispatch(fetchTasks(projectId)).unwrap().catch((err) => toast.error('Failed to fetch tasks: ' + err));
    } else {
      toast.error('No project ID provided');
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (tasksError) toast.error(tasksError);
  }, [tasksError]);

  const handleAdd = async () => {
    if (!projectId) {
      toast.error('No project ID provided');
      return;
    }
    setAddLoading(true);
    try {
      await dispatch(addTask({ projectId, description, startDate, endDate })).unwrap();
      toast.success('Task added successfully!');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      toast.error('Failed to add task: ' + err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditData({ ...task, startDate: task.startDate.slice(0, 10), endDate: task.endDate.slice(0, 10) });
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(editTask({ id: editId, data: editData })).unwrap();
      toast.success('Task updated successfully!');
      setEditId(null);
      setEditData({});
    } catch (err) {
      toast.error('Failed to update task: ' + err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        toast.success('Task deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete task: ' + err);
      }
    }
  };

  const project = projects.find((p) => p._id === projectId);
  const projectName = project ? project.name : 'Unknown Project';

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Tasks for {projectName}</h2>
      {tasksLoading || projectsLoading ? (
        <div className="flex justify-center">
          <ClipLoader size={40} color="#4B5563" />
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {tasks.map((task) => (
            <li key={task._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              {editId === task._id ? (
                <div className="space-y-2">
                  <input
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="date"
                    value={editData.startDate}
                    onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="date"
                    value={editData.endDate}
                    onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{task.description}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">Add New Task</h3>
        <div className="space-y-4">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleAdd}
            disabled={addLoading || !projectId}
            className={`w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex justify-center items-center ${
              addLoading || !projectId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {addLoading ? <ClipLoader size={20} color="#fff" /> : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskList;