import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSuppliers, addSupplier, editSupplier, deleteSupplier } from '../features/suppliers/supplierSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function SupplierList() {
  const dispatch = useAppDispatch();
  const { suppliers, loading, error } = useAppSelector((state) => state.suppliers);
  const [name, setName] = useState(''); 
  const [contactEmail, setContactEmail] = useState(''); 
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [editData, setEditData] = useState({});

  useEffect(() => {
    dispatch(fetchSuppliers()).unwrap().catch((err) => toast.error('Failed to fetch suppliers: ' + err));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleAdd = async () => {
    setAddLoading(true);
    try {
      await dispatch(addSupplier({ name, contactEmail })).unwrap();
      toast.success('Supplier added successfully!');
      setName('');
      setContactEmail('');
    } catch (err) {
      toast.error('Failed to add supplier: ' + err);
    } finally {
      setAddLoading(false); 
    }
  };

  const handleEdit = (supplier) => {
    setEditId(supplier._id); 
    setEditData({ ...supplier }); 
  };

  const handleSaveEdit = async () => {
    try {
      await dispatch(editSupplier({ id: editId, data: editData })).unwrap();
      toast.success('Supplier updated successfully!'); 
      setEditId(null); 
      setEditData({});
    } catch (err) {
      toast.error('Failed to update supplier: ' + err); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await dispatch(deleteSupplier(id)).unwrap();
        toast.success('Supplier deleted successfully!'); 
      } catch (err) {
        toast.error('Failed to delete supplier: ' + err);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>
      {loading ? (
        <div className="flex justify-center">
          <ClipLoader size={40} color="#4B5563" /> {/* Loading spinner ila kan lloading */}
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {suppliers.map((supplier) => (
            <li key={supplier._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              {editId === supplier._id ? (
                <div className="space-y-2">
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    value={editData.contactEmail}
                    onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save {/* Button l'dayal */}
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel {/* Canceller l'edit */}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{supplier.name} - {supplier.contactEmail}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier._id)}
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
        <h3 className="text-lg font-medium mb-2">Add New Supplier</h3>
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleAdd}
            disabled={addLoading}
            className={`w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors flex justify-center items-center ${
              addLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {addLoading ? <ClipLoader size={20} color="#fff" /> : 'Add Supplier'} {/* Button l'ajout */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierList;
