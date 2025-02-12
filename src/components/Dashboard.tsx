import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const menuItems = [
  { id: "sales", label: "Sales Data", icon: Tags },
  { id: "cost", label: "Cost Data", icon: ShoppingCart },
  { id: "cancellations", label: "Cancellations", icon: XCircle },
  { id: "disbursement", label: "Disbursement", icon: Wallet },
  { id: "noc", label: "NOC Application", icon: FileText },
  { id: "construction", label: "Construction Updates", icon: Construction },
  { id: "approval", label: "Approval", icon: CheckCircle2 },
];

export default function Dashboard() {
  const logo = new URL("../assets/logo.png", import.meta.url).href;
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("sales");
  const { projectId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`fixed top-0 left-0 right-0 z-30 shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <button onClick={toggleMenu} className="p-2">
              <Menu className="w-6 h-6" />
            </button>
            <img src={logo} alt="Company Logo" className="h-10 w-32" />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-7 h-7" />
              ) : (
                <Moon className="w-7 h-7" />
              )}
            </button>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
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
      </div>

      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-20 ${
          isMenuOpen ? "w-64" : "w-20"
        } ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center p-4 transition-colors font-bold ${
                activeSection === item.id
                  ? isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-black"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div
                className={`flex items-center ${
                  !isMenuOpen ? "justify-center w-full" : ""
                }`}
              >
                <item.icon className="w-6 h-6 min-w-[1.5rem]" />
                <span
                  className={`ml-3 transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      <div
        className={`transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="pt-16">
          <main className="p-6">
            <div
              className={`rounded-lg shadow p-6 ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">
                {menuItems.find((item) => item.id === activeSection)?.label}
              </h2>
              <p>
                Displaying{" "}
                {menuItems.find((item) => item.id === activeSection)?.label}{" "}
                information for Project {projectId}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
