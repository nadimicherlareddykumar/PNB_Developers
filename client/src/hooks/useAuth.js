import { useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, me as meApi } from '../api/auth';

export function useAuth() {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const storedAgent = localStorage.getItem('pnb_agent');
        if (storedAgent) {
          setAgent(JSON.parse(storedAgent));
        }

        const response = await meApi();
        setAgent(response.agent);
        localStorage.setItem('pnb_agent', JSON.stringify(response.agent));
      } catch {
        localStorage.removeItem('pnb_agent');
        setAgent(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const { agent: authenticatedAgent } = await loginApi(email, password);
    localStorage.setItem('pnb_agent', JSON.stringify(authenticatedAgent));
    setAgent(authenticatedAgent);
    return authenticatedAgent;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem('pnb_agent');
      setAgent(null);
    }
  };

  return { agent, login, logout, isLoading };
}

export default useAuth;
