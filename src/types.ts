export interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}