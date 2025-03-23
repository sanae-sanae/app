// Importing the necessary React hooks and Redux actions
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchResources, addResource, editResource, deleteResource } from '../features/resources/resourceSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function ResourceList() {
  const dispatch = useAppDispatch();
  const { resources, loading, error } = useAppSelector((state) => state.resources);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  useEffect(() => {
    dispatch(fetchResources()).unwrap().catch((err) => toast.error('Failed to fetch resources: ' + err));
  }, [dispatch]);
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  const handleAdd = async () => {
    setAddLoading(true);
    try {
      await dispatch(
        addResource({
          name,
          type,
          quantityAvailable: Number(quantityAvailable),
          costPerUnit: Number(costPerUnit),
        })
      ).unwrap();
      toast.success('Resource added successfully!');
      setName('');
      setType('');
      setQuantityAvailable('');
      setCostPerUnit('');
    } catch (err) {
      toast.error('Failed to add resource: ' + err); 
    } finally {
      setAddLoading(false);
    }
  };
  const handleEdit = (resource) => {
    setEditId(resource._id); 
    setEditData({ ...resource }); 
  };
  const handleSaveEdit = async () => {
    try {
      await dispatch(editResource({ id: editId, data: editData })).unwrap();
      toast.success('Resource updated successfully!');
      setEditId(null); 
      setEditData({}); 
    } catch (err) {
      toast.error('Failed to update resource: ' + err); 
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await dispatch(deleteResource(id)).unwrap();
        toast.success('Resource deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete resource: ' + err);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Resources</h2>
      {loading ? (
        <div className="flex justify-center">
          <ClipLoader size={40} color="#4B5563" />
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {resources.map((resource) => (
            <li key={resource._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              {editId === resource._id ? (
                <div className="space-y-2">
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    value={editData.quantityAvailable}
                    onChange={(e) => setEditData({ ...editData, quantityAvailable: Number(e.target.value) })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="number"
                    value={editData.costPerUnit}
                    onChange={(e) => setEditData({ ...editData, costPerUnit: Number(e.target.value) })}
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
                  <span>{resource.name} ({resource.quantityAvailable})</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource._id)}
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
        <h3 className="text-lg font-medium mb-2">Add New Resource</h3>
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            type="number"
            value={quantityAvailable}
            onChange={(e) => setQuantityAvailable(e.target.value)}
            placeholder="Quantity Available"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            type="number"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(e.target.value)}
            placeholder="Cost Per Unit"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleAdd}
            disabled={addLoading}
            className={`w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex justify-center items-center ${addLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {addLoading ? <ClipLoader size={20} color="#fff" /> : 'Add Resource'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceList;
