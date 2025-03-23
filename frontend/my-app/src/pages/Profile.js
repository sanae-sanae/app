import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';


const updateProfile = (data) => ({
  type: 'auth/updateProfile',
  payload: data,
});

function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth || {});
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
    setFullName(user?.fullName || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await dispatch(updateProfile({ email, fullName })).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile: ' + err);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h3 className="text-lg font-medium mb-4">Update Your Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors flex justify-center items-center ${
              profileLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {profileLoading ? <ClipLoader size={20} color="#fff" /> : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;