// import { useNavigate } from "react-router-dom";
// import { Building, UserRound, LogOut, Sun, Moon } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Project } from "../types";
// import axios from "axios";
// import endpoints from "../endpoints";

// export default function ProjectListComponent() {
//   const navigate = useNavigate();
//   const logo = new URL("../assets/logo.png", import.meta.url).href;
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     return localStorage.getItem("theme") === "dark";
//   });
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     localStorage.setItem("theme", isDarkMode ? "dark" : "light");
//   }, [isDarkMode]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const borrowerCode = localStorage.getItem("borrowerCode");
//         if (borrowerCode) {
//           // const response = await axios.get(
//           //   `https://localhost:44341/api/project/${borrowerCode}`
//           // );
//           const response = await axios.get(
//             endpoints.project + borrowerCode
//           );          
//           // Map API response to match the expected Project type
//           const mappedProjects = response.data.map((proj: any) => ({
//             projectNumber: proj.ProjectNumber,
//             projectName: proj.ProjectName,
//             totalIRR: proj.TotalIRR,
//             borrowerIRR: proj.BorrowerIRR,
//           }));
//           setProjects(mappedProjects);
//           // Update state with the mapped data
//         }
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("userProfile");
//     navigate("/");
//   };

//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
//       }`}
//     >
//       <header
//         className={`fixed top-0 left-0 right-0 z-30 shadow-md ${
//           isDarkMode ? "bg-gray-800" : "bg-white"
//         }`}
//       >
//         <div className="flex items-center justify-between h-16 px-4">
//           <div className="flex items-center space-x-4">
//             <img src={logo} alt="Company Logo" className="h-10 w-32" />
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               onClick={toggleTheme}
//               className={`p-2 rounded-lg transition-colors ${
//                 isDarkMode
//                   ? "hover:bg-gray-700 text-gray-300"
//                   : "hover:bg-gray-200 text-gray-600"
//               }`}
//             >
//               {isDarkMode ? (
//                 <Sun className="w-7 h-7" />
//               ) : (
//                 <Moon className="w-7 h-7" />
//               )}
//             </button>
//             <button
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//                 isDarkMode
//                   ? "text-gray-300 hover:bg-gray-700"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               <UserRound className="w-7 h-7" />
//             </button>
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <LogOut className="w-5 h-7" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="relative z-10 container mx-auto px-4 py-24">
//         <h1 className="text-4xl font-bold mb-8 text-center">Select Project</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project, index) => (
//             <div
//               key={`${project.projectNumber}-${index}`}
//               onClick={() => navigate(`/dashboard/${project.projectNumber}`)}
//               className={`p-6 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform 
//             ${
//               isDarkMode
//                 ? "bg-gray-800 text-white hover:bg-gray-700"
//                 : "bg-white text-black hover:bg-gray-100"
//             }`}
//             >
//               <div className="flex items-center mb-4">
//                 <Building
//                   className={`w-8 h-8 mr-3 ${
//                     isDarkMode ? "text-white" : "text-black"
//                   }`}
//                 />
//                 <h3
//                   className={`text-2xl font-bold ${
//                     isDarkMode ? "text-white" : "text-black"
//                   }`}
//                 >
//                   {project.projectName}
//                 </h3>
//               </div>
//               <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
//                 Project Number: {project.projectNumber}
//               </p>
//               <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
//                 Total IRR: {project.totalIRR}
//               </p>
//               <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
//                 Borrower IRR: {project.borrowerIRR}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { Building, UserRound, LogOut, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "../types";
import endpoints from "../endpoints";

export default function ProjectListComponent() {
  const navigate = useNavigate();
  const logo = new URL("../assets/logo.png", import.meta.url).href;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const role = localStorage.getItem("role");
        let code = localStorage.getItem(`${role?.toLowerCase()}Code`); // Get the correct code dynamically

        if (!role) {
          console.error("Missing role");
          return;
        }

        let url = endpoints.project + `/${role}`;
        if (role !== "Arbour" && !code) {
          console.error("Missing code for role", role);
          return;
        }
        if (role !== "Arbour") {
          url += `/${code}`;
        }

        console.log("Fetching projects for:", { role, code });

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        console.log("API Response Data:", data); // ✅ Debugging: Check response format

        // Ensure correct mapping of fields from API response
        const mappedProjects = data.map((proj: any) => ({
          projectNumber: proj.ProjectNumber, // ✅ Updated field name
          projectName: proj.ProjectName,
          totalIRR: proj.TotalIRR,
          borrowerIRR: proj.BorrowerIRR,
        }));

        console.log("Mapped Projects:", mappedProjects); // ✅ Debugging: Check processed data

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("code");
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}
    >
      <header
        className={`fixed top-0 left-0 right-0 z-30 shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Company Logo" className="h-10 w-32" />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              {isDarkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UserRound className="w-7 h-7" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-7" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8 text-center">Select Project</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={`${project.projectNumber}-${index}`}
              onClick={() => navigate(`/dashboard/${project.projectNumber}`)}
              className={`p-6 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform 
            ${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-100"}`}
            >
              <div className="flex items-center mb-4">
                <Building className={`w-8 h-8 mr-3 ${isDarkMode ? "text-white" : "text-black"}`} />
                <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                  {project.projectName}
                </h3>
              </div>
              <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
                Project Number: {project.projectNumber}
              </p>
              <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
                Total IRR: {project.totalIRR}
              </p>
              <p className={`${isDarkMode ? "text-white" : "text-black"}`}>
                Borrower IRR: {project.borrowerIRR}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
