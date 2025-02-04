import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  LogOut,
  BarChart3,
  DollarSign,
  XCircle,
  Building2,
  FileText,
  Construction,
  CheckCircle2
} from 'lucide-react';

const menuItems = [
  { id: 'sales', label: 'Sales Data', icon: BarChart3 },
  { id: 'cost', label: 'Cost Data', icon: DollarSign },
  { id: 'cancellations', label: 'Cancellations', icon: XCircle },
  { id: 'disbursement', label: 'Disbursement', icon: Building2 },
  { id: 'noc', label: 'NOC Application', icon: FileText },
  { id: 'construction', label: 'Construction Updates', icon: Construction },
  { id: 'approval', label: 'Approval', icon: CheckCircle2 },
];

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('sales');
  const { projectId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isMenuOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          <h2 className={`font-bold text-emerald-600 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Project {projectId}
          </h2>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center p-4 hover:bg-emerald-50 transition-colors ${
                activeSection === item.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6 mr-3" />
              <span className={`transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              {/* Content for each section would go here */}
              <p className="text-gray-600">
                Displaying {menuItems.find(item => item.id === activeSection)?.label} information for Project {projectId}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}