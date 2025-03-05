// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { AuthContextType } from '../types';
// import endpoints from '../endpoints';

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
//   const [error, setError] = useState('');
//   const [role, setRole] = useState<string | null>(() => localStorage.getItem('role') || null);
//   const [borrowerCode, setBorrowerCode] = useState<string | null>(() => localStorage.getItem('borrowerCode') || null);
//   const [trusteeCode, setTrusteeCode] = useState<string | null>(() => localStorage.getItem('trusteeCode') || null);
//   const [pmeCode, setPmeCode] = useState<string | null>(() => localStorage.getItem('pmeCode') || null);

//   useEffect(() => {
//     localStorage.setItem('isAuthenticated', isAuthenticated.toString());
//   }, [isAuthenticated]);

//   const login = async (username: string, password: string): Promise<boolean> => {
//     try {
//       console.log('Sending login request with:', { username, password });
//       const requestBody = { username, password };

//       const response = await fetch(endpoints.login, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Login successful:', data);

//         setIsAuthenticated(true);
//         setRole(data.role || null);
//         setError('');

//         if (data.role === 'Borrower') {
//           setBorrowerCode(data.borrowerCode);
//           localStorage.setItem('borrowerCode', data.borrowerCode);
//         } else if (data.role === 'Trustee') {
//           setTrusteeCode(data.trusteeCode);
//           localStorage.setItem('trusteeCode', data.trusteeCode);
//         } else if (data.role === 'PME') {
//           setPmeCode(data.pmeCode);
//           localStorage.setItem('pmeCode', data.pmeCode);
//         }

//         localStorage.setItem('isAuthenticated', 'true');
//         localStorage.setItem('role', data.role || '');
//         return true;
//       } else {
//         const errorData = await response.json();
//         console.error('Login failed:', errorData);
//         setError(errorData.message || 'Invalid credentials');
//       }
//     } catch (error) {
//       console.error('Fetch Error:', error);
//       setError('An error occurred');
//     }
//     return false;
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setRole(null);
//     setBorrowerCode(null);
//     setTrusteeCode(null);
//     setPmeCode(null);

//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('role');
//     localStorage.removeItem('borrowerCode');
//     localStorage.removeItem('trusteeCode');
//     localStorage.removeItem('pmeCode');
//     // IMPORTANT: Ensure 'rememberedCredentials' is NOT removed here.
// };
  

//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated, 
//       login, 
//       logout, 
//       error,
//       role,
//       borrowerCode,
//       trusteeCode,
//       pmeCode
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types';
import endpoints from '../endpoints';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [error, setError] = useState('');
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role') || null);
  const [borrowerCode, setBorrowerCode] = useState<string | null>(() => localStorage.getItem('borrowerCode') || null);
  const [trusteeCode, setTrusteeCode] = useState<string | null>(() => localStorage.getItem('trusteeCode') || null);
  const [pmeCode, setPmeCode] = useState<string | null>(() => localStorage.getItem('pmeCode') || null);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Sending login request with:', { username, password });
      const requestBody = { username, password };

      const response = await fetch(endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);

        setIsAuthenticated(true);
        setRole(data.role || null);
        setError('');

        if (data.role === 'Borrower') {
          setBorrowerCode(data.code);
          localStorage.setItem('borrowerCode', data.code);
        } else if (data.role === 'Trustee') {
          setTrusteeCode(data.code);
          localStorage.setItem('trusteeCode', data.code);
        } else if (data.role === 'PME') {
          setPmeCode(data.code);
          localStorage.setItem('pmeCode', data.code);
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', data.role || '');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setError(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('An error occurred');
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setBorrowerCode(null);
    setTrusteeCode(null);
    setPmeCode(null);

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    localStorage.removeItem('borrowerCode');
    localStorage.removeItem('trusteeCode');
    localStorage.removeItem('pmeCode');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      error,
      role,
      borrowerCode,
      trusteeCode,
      pmeCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
