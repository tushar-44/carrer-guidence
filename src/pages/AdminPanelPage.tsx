import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores/userStore';

export function AdminPanelPage() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();

  useEffect(() => {
    // Mock role check - redirect if not admin
    if (!currentUser || currentUser.type !== 'mentor') { // Using mentor as admin proxy
      navigate('/');
      return;
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.type !== 'mentor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">User Management</h3>
              <p className="text-blue-700">Manage platform users and roles</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Content Moderation</h3>
              <p className="text-green-700">Review and moderate content</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Analytics</h3>
              <p className="text-purple-700">View platform analytics and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
