import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">View your account information</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="mt-1 font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                  {user.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="mt-1 font-mono text-gray-900 break-all">{user.id}</p>
              </div>
            </div>

            {/* Future: Address/Phone from backend profile */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              Looking to add more details (address, phone, etc.)? We can extend this page to fetch your full
              profile from the backend once the endpoint is available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

