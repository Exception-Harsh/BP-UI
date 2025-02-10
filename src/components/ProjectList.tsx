// import { useNavigate } from 'react-router-dom';
// import { Building, ChevronRight, UserCircle, LogOut } from 'lucide-react';
// import { Project } from '../types';

// const projects: Project[] = [
//   { id: 'v001', name: 'Project V001', location: 'Downtown Business District', status: 'In Progress' },
//   { id: 'v002', name: 'Project V002', location: 'Waterfront Development', status: 'Planning' },
//   { id: 'v003', name: 'Project V003', location: 'Tech Hub Zone', status: 'Construction' },
//   { id: 'v004', name: 'Project V004', location: 'Residential Complex', status: 'Final Stage' },
// ];

// export default function ProjectList() {
//   const navigate = useNavigate();
//   const logo = new URL("../assets/logo.png", import.meta.url).href;

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');  // Clear only the auth token
//     localStorage.removeItem('userProfile'); // Clear user profile if stored
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen relative">
//       <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-white/90 shadow-md p-4 backdrop-blur-sm z-20">
//         <img src={logo} alt="Company Logo" className="h-10 w-32" />
//         <div className="flex items-center space-x-4">
//           <button className="flex items-center text-gray-700 hover:text-[#00134B]">
//             <UserCircle className="w-6 h-6 mr-1" /> Profile
//           </button>
//           <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800">
//             <LogOut className="w-6 h-6 mr-1" /> Logout
//           </button>
//         </div>
//       </header>

//       <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{
//         backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
//       }} />
//       <div className="absolute inset-0 bg-black/60 z-0" />

//       <div className="relative z-10 container mx-auto px-4 py-24">
//         <h1 className="text-4xl font-bold text-white mb-8 text-center">Select Project</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               onClick={() => navigate(`/dashboard/${project.id}`)}
//               className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300"
//             >
//               <div className="flex items-center mb-4">
//                 <Building className="w-8 h-8 text-[#00134B] mr-3" />
//                 <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
//               </div>

//               <div className="space-y-2 mb-4">
//                 <p className="text-gray-600">
//                   <span className="font-medium">Location:</span> {project.location}
//                 </p>
//                 <p className="text-gray-600">
//                   <span className="font-medium">Status:</span>{' '}
//                   <span className="inline-block px-2 py-1 text-sm rounded-full bg-[#00134B]/10 text-[#00134B]">
//                     {project.status}
//                   </span>
//                 </p>
//               </div>

//               <div className="flex items-center justify-end text-[#00134B]">
//                 <span className="text-sm font-medium">View Details</span>
//                 <ChevronRight className="w-4 h-4 ml-1" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from 'react-router-dom';
import { Building, ChevronRight, UserCircle2, LogOut } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  { id: 'v001', name: 'Project V001', location: 'Downtown Business District', status: 'In Progress' },
  { id: 'v002', name: 'Project V002', location: 'Waterfront Development', status: 'Planning' },
  { id: 'v003', name: 'Project V003', location: 'Tech Hub Zone', status: 'Construction' },
  { id: 'v004', name: 'Project V004', location: 'Residential Complex', status: 'Final Stage' },
];

export default function ProjectList() {
  const navigate = useNavigate();
  const logo = new URL("../assets/logo.png", import.meta.url).href;

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Clear only the auth token
    localStorage.removeItem('userProfile'); // Clear user profile if stored
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative">
      <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
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
      </header>

      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
      }} />
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Select Project</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/dashboard/${project.id}`)}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <Building className="w-8 h-8 text-[#00134B] mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {project.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="inline-block px-2 py-1 text-sm rounded-full bg-[#00134B]/10 text-[#00134B]">
                    {project.status}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-end text-[#00134B]">
                <span className="text-sm font-medium">View Details</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
