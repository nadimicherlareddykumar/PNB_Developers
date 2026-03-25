import { useState, useEffect } from 'react';
import { login as loginApi } from '../api/auth';

export function useAuth() {
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAgent = localStorage.getItem('pnd_agent');
    const token = localStorage.getItem('pnd_token');
    if (storedAgent && token) {
      setAgent(JSON.parse(storedAgent));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const { token, agent } = await loginApi(email, password);
    localStorage.setItem('pnd_token', token);
    localStorage.setItem('pnd_agent', JSON.stringify(agent));
    setAgent(agent);
    return agent;
  };

  const logout = () => {
    localStorage.removeItem('pnd_token');
    localStorage.removeItem('pnd_agent');
    setAgent(null);
  };

  return { agent, login, logout, isLoading };
}

export default useAuth;
