import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProjects, addProject, editProject, deleteProject } from '../features/projects/projectSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function ProjectList() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const { user } = useAppSelector((state) => state.auth); 
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    dispatch(fetchProjects()).unwrap().catch((err) => {
      console.log('Fetch projects error:', err);
      toast.error('Failed to fetch projects: ' + err);
    });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log('Error from state:', error);
      toast.error(error);
    }
  }, [error]);

  const handleAdd = async () => {
    setAddLoading(true);
    const projectData = { name, startDate, endDate, budget: Number(budget) };
    console.log('Adding project:', projectData);
    try {
      await dispatch(addProject(projectData)).unwrap();
      toast.success('Project added successfully!');
      setName('');
      setStartDate('');
      setEndDate('');
      setBudget('');
    } catch (err) {
      console.log('Add project error:', err);
      toast.error('Failed to add project: ' + err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditId(project._id);
    setEditData({ ...project, startDate: project.startDate.slice(0, 10), endDate: project.endDate.slice(0, 10) });
  };

  const handleSaveEdit = async () => {
    console.log('Editing project:', editData);
    try {
      await dispatch(editProject({ id: editId, data: editData })).unwrap();
      toast.success('Project updated successfully!');
      setEditId(null);
      setEditData({});
    } catch (err) {
      console.log('Edit project error:', err); 
      toast.error('Failed to update project: ' + err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success('Project deleted successfully!');
      } catch (err) {
        console.log('Delete project error:', err);
        toast.error('Failed to delete project: ' + err);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      {loading ? (
        <div className="flex justify-center">
          <ClipLoader size={40} color="#4B5563" />
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {projects.map((project) => (
            <li key={project._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              {editId === project._id ? (
                <div className="space-y-2">
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
                  <input
                    type="number"
                    value={editData.budget}
                    onChange={(e) => setEditData({ ...editData, budget: Number(e.target.value) })}
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
                  <span>{project.name} - ${project.budget.toLocaleString()}</span>
                  <div className="space-x-2">
                    <Link
                      to={`/tasks/${project._id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View Tasks
                    </Link>
                    <button
                      onClick={() => handleEdit(project)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
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
        <h3 className="text-lg font-medium mb-2">Add New Project</h3>
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
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
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleAdd}
            disabled={addLoading}
            className={`w-full p-2 rounded ${addLoading ? 'bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {addLoading ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectList;