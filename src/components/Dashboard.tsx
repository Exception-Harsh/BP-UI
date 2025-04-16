// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import AssetSalesComponent from "./AssetSalesCard";
// import {
//   Tags,
//   ShoppingCart,
//   Wallet,
//   XCircle,
//   FileText,
//   Construction,
//   CheckCircle2,
//   UserRound,
//   LogOut,
//   Sun,
//   Moon,
//   Menu,
// } from "lucide-react";
// import endpoints from "../endpoints";

// const menuItems = [
//   { id: "sales", label: "Sales Data", icon: Tags },
//   { id: "cost", label: "Cost Data", icon: ShoppingCart },
//   { id: "cancellations", label: "Cancellations", icon: XCircle },
//   { id: "disbursement", label: "Disbursement", icon: Wallet },
//   { id: "noc", label: "NOC Application", icon: FileText },
//   { id: "construction", label: "Construction Updates", icon: Construction },
//   { id: "approval", label: "Approval", icon: CheckCircle2 },
// ];

// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// const formatYearMonth = (yearMonth: string | any[]) => {
//   if (typeof yearMonth !== 'string') {
//     console.error("yearMonth is not a string:", yearMonth);
//     return "";
//   }

//   const year = yearMonth.slice(0, 4);
//   const month = yearMonth.slice(4, 6);
//   return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
// };


// export default function Dashboard() {
//   const logo = new URL("../assets/logo.png", import.meta.url).href;
//   const [isMenuOpen, setIsMenuOpen] = useState(true);
//   const [activeSection, setActiveSection] = useState("sales");
//   const { projectId } = useParams();
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role");
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     return localStorage.getItem("theme") === "dark";
//   });
//   const [yearMonth, setYearMonth] = useState("");

//   useEffect(() => {
//     localStorage.setItem("theme", isDarkMode ? "dark" : "light");
//   }, [isDarkMode]);

//   useEffect(() => {
//     if (projectId) {
//       localStorage.setItem("projectNumber", projectId);
//     }
//   }, [projectId]);

//   useEffect(() => {
//     const fetchYearMonth = async () => {
//       try {
//         const response = await fetch(endpoints.yearmonth + `${projectId}/${role}`);
//         if (response.ok) {
//           const data = await response.json();

//           if (data.nextYearMonth) {
//             // Insert occurred, use the new inserted month
//             setYearMonth(data.nextYearMonth);
//             localStorage.setItem("yearMonth", data.nextYearMonth);
//           } else if (data.maxYearMonth) {
//             // No insert, use existing max
//             setYearMonth(data.maxYearMonth);
//             localStorage.setItem("yearMonth", data.maxYearMonth);

//             // Optional: handle info message from backend
//             if (data.message) {
//               console.info(data.message); // or show in UI as a toast
//             }
//           } else {
//             console.warn("No YearMonth value returned in response.");
//           }
//         } else {
//           console.error("Failed to fetch YearMonth data");
//         }
//       } catch (error) {
//         console.error("Error fetching YearMonth data:", error);
//       }
//     };

//     if (projectId && role) {
//       fetchYearMonth();
//     }
//   }, [projectId, role]);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen((prevState) => !prevState);
//   };

//   return (
//     <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
//       <div className={`fixed top-0 left-0 right-0 z-30 shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
//         <div className="flex items-center justify-between h-16 px-4">
//           <div className="flex items-center space-x-4">
//             <button onClick={toggleMenu} className="p-2">
//               <Menu className="w-6 h-6" />
//             </button>
//             <img src={logo} alt="Company Logo" className="h-10 w-32" />
//           </div>
//           <div className="flex items-center space-x-2">
//             <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
//               {isDarkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
//             </button>
//             <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
//               <UserRound className="w-7 h-7" />
//             </button>
//             <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//               <LogOut className="w-5 h-7" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-20 ${isMenuOpen ? "w-64" : "w-20"} ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
//         <nav className="mt-4">
//           {menuItems.map((item) => (
//             <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center p-4 transition-colors font-bold ${activeSection === item.id ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}`}>
//               <div className={`flex items-center ${!isMenuOpen ? "justify-center w-full" : ""}`}>
//                 <item.icon className="w-6 h-6 ml-2 min-w-[1.5rem]" />
//                 <span className={`ml-3 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>{item.label}</span>
//               </div>
//             </button>
//           ))}
//         </nav>
//       </div>
//       <div className={`transition-all duration-300 ${isMenuOpen ? "ml-64 w-[calc(100vw-16rem)]" : "ml-20 w-[calc(100vw-5rem)]"}`}>
//         <div className="pt-16 min-h-screen">
//           <main className="p-6">
//             <div className={`rounded-lg shadow p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
//               <h2 className="text-xl font-semibold mb-4">{menuItems.find((item) => item.id === activeSection)?.label}</h2>
//               {activeSection === "sales" && (
//                 <>
//                   {yearMonth && (
//                     <div className="mt-4 flex gap-2">
//                       <h3 className="text-lg font-semibold">Year-Month: {formatYearMonth(yearMonth)}</h3>
                    
//                     </div>
//                   )}
//                   <AssetSalesComponent isDarkMode={isDarkMode} />
//                 </>
//               )}
//               {activeSection !== "sales" && (
//                 <p>Displaying {menuItems.find((item) => item.id === activeSection)?.label} information for Project {projectId}</p>
//               )}
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AssetSalesComponent from "./AssetSalesCard";
import {
  Tags,
  ShoppingCart,
  Wallet,
  XCircle,
  FileText,
  Construction,
  CheckCircle2,
  UserRound,
  LogOut,
  Sun,
  Moon,
  Menu,
} from "lucide-react";

const domain = "https://localhost:44341/api";

const endpoints = {
  project: domain + "/project",
  sales: domain + "/assetsales/",
  login: domain + "/login",
  update: domain + "/assetsales/update/",
  yearmonth: domain + "/assetsales/nextyearmonth/",
  workflow: domain + "/assetsales/workflow/",
  projectheader: domain + "/assetsales/hdr/",
  updateProjecthdr: domain + "/assetsales/updatehdr"
};

const menuItems = [
  { id: "sales", label: "Sales Data", icon: Tags },
  { id: "cost", label: "Cost Data", icon: ShoppingCart },
  { id: "cancellations", label: "Cancellations", icon: XCircle },
  { id: "disbursement", label: "Disbursement", icon: Wallet },
  { id: "noc", label: "NOC Application", icon: FileText },
  { id: "construction", label: "Construction Updates", icon: Construction },
  { id: "approval", label: "Approval", icon: CheckCircle2 },
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatYearMonth = (yearMonth: string | any[]) => {
  if (typeof yearMonth !== 'string') {
    console.error("yearMonth is not a string:", yearMonth);
    return "";
  }

  const year = yearMonth.slice(0, 4);
  const month = yearMonth.slice(4, 6);
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
};

export default function Dashboard() {
  const logo = new URL("../assets/logo.png", import.meta.url).href;
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("sales");
  const { projectId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [yearMonth, setYearMonth] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem("projectNumber", projectId);
    }
  }, [projectId]);

  useEffect(() => {
    const fetchYearMonth = async () => {
      try {
        const response = await fetch(endpoints.yearmonth + `${projectId}/${role}`);
        if (response.ok) {
          const data = await response.json();

          if (data.nextYearMonth) {
            // Insert occurred, use the new inserted month
            setYearMonth(data.nextYearMonth);
            localStorage.setItem("yearMonth", data.nextYearMonth);
          } else if (data.maxYearMonth) {
            // No insert, use existing max
            setYearMonth(data.maxYearMonth);
            localStorage.setItem("yearMonth", data.maxYearMonth);

            // Optional: handle info message from backend
            if (data.message) {
              console.info(data.message); // or show in UI as a toast
            }
          } else {
            console.warn("No YearMonth value returned in response.");
          }
        } else {
          console.error("Failed to fetch YearMonth data");
        }
      } catch (error) {
        console.error("Error fetching YearMonth data:", error);
      }
    };

    if (projectId && role) {
      fetchYearMonth();
    }
  }, [projectId, role]);

  useEffect(() => {
    const insertHeader = async () => {
      if (!projectId || !yearMonth) {
        console.error("Project number or year-month is missing.");
        setStatus("Project number or year-month is missing.");
        return;
      }

      // Get the username from localStorage
      const credentials = localStorage.getItem("rememberedCredentials");
      const parsedCredentials = credentials ? JSON.parse(credentials) : null;
      const username = parsedCredentials?.username ?? "";

      if (!username) {
        console.error("Username is missing.");
        setStatus("Username is missing.");
        return;
      }

      const requestBody = {
        UserName: username,
        Remarks: remarks // Optional remarks
      };

      try {
        const response = await fetch(
          `${endpoints.projectheader}${projectId}/${yearMonth}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          console.error("Failed to insert header");
          setStatus("Insert failed. Please try again.");
        } else {
          const result = await response.json();
          console.log("Insert successful", result);
          setStatus("Insert successful!");
        }
      } catch (error) {
        console.error("Error inserting header:", error);
        setStatus("Insert failed. Check console for details.");
      }
    };

    // Call the insertHeader function when dependencies change
    insertHeader();
  }, [projectId, yearMonth, remarks]); // Dependencies array

  // useEffect(() => {
  //   const updateApprovalFlag = async () => {
  //     if (!projectId || !yearMonth) {
  //       console.error("Project number or year-month is missing.");
  //       setUpdateStatus("Project number or year-month is missing.");
  //       return;
  //     }

  //     // Get the username from localStorage
  //     const credentials = localStorage.getItem("rememberedCredentials");
  //     const parsedCredentials = credentials ? JSON.parse(credentials) : null;
  //     const username = parsedCredentials?.username ?? "";

  //     if (!username) {
  //       console.error("Username is missing.");
  //       setUpdateStatus("Username is missing.");
  //       return;
  //     }

  //     const requestBody = {
  //       UserName: username,
  //       Remarks: remarks // Optional remarks
  //     };

  //     try {
  //       const response = await fetch(
  //         `${endpoints.updateProjecthdr}/${projectId}/${yearMonth}`,
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(requestBody),
  //         }
  //       );

  //       if (!response.ok) {
  //         console.error("Failed to update approval flag");
  //         setUpdateStatus("Update failed. Please try again.");
  //       } else {
  //         const result = await response.json();
  //         console.log("Update successful", result);
  //         setUpdateStatus("Update successful!");
  //       }
  //     } catch (error) {
  //       console.error("Error updating approval flag:", error);
  //       setUpdateStatus("Update failed. Check console for details.");
  //     }
  //   };

  //   // Call the updateApprovalFlag function when dependencies change
  //   updateApprovalFlag();
  // }, [projectId, yearMonth, remarks]); // Dependencies array

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className={`fixed top-0 left-0 right-0 z-30 shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button onClick={toggleMenu} className="p-2">
              <Menu className="w-6 h-6" />
            </button>
            <img src={logo} alt="Company Logo" className="h-10 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
              {isDarkMode ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
              <UserRound className="w-7 h-7" />
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-7" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-20 ${isMenuOpen ? "w-64" : "w-20"} ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center p-4 transition-colors font-bold ${activeSection === item.id ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100")}`}>
              <div className={`flex items-center ${!isMenuOpen ? "justify-center w-full" : ""}`}>
                <item.icon className="w-6 h-6 ml-2 min-w-[1.5rem]" />
                <span className={`ml-3 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
      <div className={`transition-all duration-300 ${isMenuOpen ? "ml-64 w-[calc(100vw-16rem)]" : "ml-20 w-[calc(100vw-5rem)]"}`}>
        <div className="pt-16 min-h-screen">
          <main className="p-6">
            <div className={`rounded-lg shadow p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
              <h2 className="text-xl font-semibold mb-4">{menuItems.find((item) => item.id === activeSection)?.label}</h2>
              {activeSection === "sales" && (
                <>
                  {yearMonth && (
                    <div className="mt-4 flex gap-2">
                      <h3 className="text-lg font-semibold">Year-Month: {formatYearMonth(yearMonth)}</h3>
                    </div>
                  )}
                  <AssetSalesComponent isDarkMode={isDarkMode} />
                </>
              )}
              {activeSection !== "sales" && (
                <p>Displaying {menuItems.find((item) => item.id === activeSection)?.label} information for Project {projectId}</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}