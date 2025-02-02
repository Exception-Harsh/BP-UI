export interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}