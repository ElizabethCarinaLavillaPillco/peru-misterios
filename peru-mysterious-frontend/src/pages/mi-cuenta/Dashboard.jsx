// ============================================
// src/pages/Dashboard.jsx (Cliente)
// ============================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import UpcomingTrips from '@/components/dashboard/UpcomingTrips';
import RecentTrips from '@/components/dashboard/RecentTrips';
import StatisticsCard from '@/components/dashboard/StatisticsCard';
import PreferencesCard from '@/components/dashboard/PreferencesCard';
import RewardsSection from '@/components/dashboard/RewardsSection';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <WelcomeBanner userName={user.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserProfileCard user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Mis Reservas</h3>
              <p className="text-gray-600">
                Aún no tienes reservas. ¡Explora nuestros tours y comienza tu aventura!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}