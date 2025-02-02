import { useNavigate } from 'react-router-dom';
import { Building, ChevronRight } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  { id: 'v001', name: 'Project V001', location: 'Downtown Business District', status: 'In Progress' },
  { id: 'v002', name: 'Project V002', location: 'Waterfront Development', status: 'Planning' },
  { id: 'v003', name: 'Project V003', location: 'Tech Hub Zone', status: 'Construction' },
  { id: 'v004', name: 'Project V004', location: 'Residential Complex', status: 'Final Stage' },
];

export default function ProjectList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Select Project</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/dashboard/${project.id}`)}
              className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <Building className="w-8 h-8 text-emerald-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {project.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="inline-block px-2 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800">
                    {project.status}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-end text-emerald-600">
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