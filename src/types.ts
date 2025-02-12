export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string;
}

export interface Project {
    projectName: string;
    projectNumber: string;
    totalIRR: number;
    borrowerIRR: number;
}

export interface LoginResponse {
  message: string;
  code?: string; // Optional because not all logins return a code
}
