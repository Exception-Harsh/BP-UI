import { useState } from 'react';
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
  CheckCircle2,
  UserCircle2
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
  const logo = new URL("../assets/logo.png", import.meta.url).href;
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
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <img src={logo} alt="Company Logo" className="h-10 w-32" />
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <UserCircle2 className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-20 ${isMenuOpen ? 'w-64' : 'w-20'}`}>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center p-4 hover:bg-[#8089A5] transition-colors font-bold ${
                activeSection === item.id ? 'bg-[#B3B8C9] text-black' : 'text-gray-600 font-bold'
              }`}
            >
              <div className={`flex items-center ${!isMenuOpen ? 'justify-center w-full' : ''}`}>
                <item.icon className="w-6 h-6 min-w-[1.5rem]" />
                <span className={`ml-3 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="pt-16">
          <main className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-gray-600">
                Displaying {menuItems.find(item => item.id === activeSection)?.label} information for Project {projectId}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}