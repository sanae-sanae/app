import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function Login() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate(); 
  const { isAuthenticated, error: authError, loading } = useAppSelector((state) => state.auth || {}); 
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login successful!');
      navigate('/', { replace: true });
    }
    if (authError) {
      toast.error(authError);
    }
  }, [isAuthenticated, authError, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ username, password })).unwrap();
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };
  const handleGoogleLogin = () => {
    toast.info('Login with Google clicked');
  };
  const handleGitHubLogin = () => {
    toast.info('Login with GitHub clicked');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors flex justify-center items-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-center text-gray-600">Or login with</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
            >
              Login with Google
            </button>
            <button
              onClick={handleGitHubLogin}
              className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition-colors"
            >
              Login with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;