import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Package } from 'lucide-react';

const CuttingCleaningDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isHub = user?.loginType === 'hub';

  const stats = [
    {
      title: 'Cutting Types',
      value: isHub ? '24' : '18',
      icon: Scissors,
      color: 'text-teal-600',
      bg: 'bg-teal-100'
    },
    {
      title: 'Products',
      value: isHub ? '156' : '89',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Cutting & Cleaning Dashboard</h1>
        <p className="text-teal-100">{isHub ? 'Hub' : 'Store'} Cutting Operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <button 
          onClick={() => navigate(isHub ? '/hub/products/cutting-types' : '/store/products/cutting-types')}
          className="w-full p-4 text-left bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Scissors className="h-5 w-5 text-teal-600" />
            <span className="font-medium">Manage Cutting Types</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CuttingCleaningDashboard;
