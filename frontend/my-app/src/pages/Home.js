import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProjects } from '../features/projects/projectSlice';
import { fetchResources } from '../features/resources/resourceSlice';
import { fetchSuppliers } from '../features/suppliers/supplierSlice';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function Home() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth || {});
  const { projects, loading: projectsLoading } = useAppSelector((state) => state.projects);
  const { resources, loading: resourcesLoading } = useAppSelector((state) => state.resources);
  const { suppliers, loading: suppliersLoading } = useAppSelector((state) => state.suppliers);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchResources());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">ConstructionXpert Dashboard</h1>
      <p className="text-lg text-center mb-8">Welcome, {user?.username || 'User'}!</p>
      <div className="space-y-8">
        {/* Projects */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          {projectsLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={40} color="#4B5563" />
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <li
                  key={project._id}
                  className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <span>{project.name} - ${project.budget.toLocaleString()}</span>
                  <Link
                    to={`/tasks/${project._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    View Tasks
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="text-center mt-4">
            Manage projects at <Link to="/projects" className="text-blue-600 hover:underline">Projects</Link>.
          </p>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Resources</h2>
          {resourcesLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={40} color="#4B5563" />
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <li key={resource._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  {resource.name} ({resource.quantityAvailable})
                </li>
              ))}
            </ul>
          )}
          <p className="text-center mt-4">
            Manage resources at <Link to="/resources" className="text-blue-600 hover:underline">Resources</Link>.
          </p>
        </div>

        {/* Suppliers */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>
          {suppliersLoading ? (
            <div className="flex justify-center">
              <ClipLoader size={40} color="#4B5563" />
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((supplier) => (
                <li key={supplier._id} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                  {supplier.name} - {supplier.contactEmail}
                </li>
              ))}
            </ul>
          )}
          <p className="text-center mt-4">
            Manage suppliers at <Link to="/suppliers" className="text-blue-600 hover:underline">Suppliers</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;