import { useState, useEffect } from 'react';
import { getLayouts, getLayout, createLayout, updateLayout, deleteLayout } from '../api/layouts';

export function useLayouts() {
  const [layouts, setLayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLayouts = async () => {
    try {
      setIsLoading(true);
      const data = await getLayouts();
      setLayouts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLayout = async (id) => {
    try {
      setIsLoading(true);
      return await getLayout(id);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (data) => {
    const newLayout = await createLayout(data);
    setLayouts(prev => [newLayout, ...prev]);
    return newLayout;
  };

  const update = async (id, data) => {
    const updated = await updateLayout(id, data);
    setLayouts(prev => prev.map(l => l.id === id ? updated : l));
    return updated;
  };

  const remove = async (id) => {
    await deleteLayout(id);
    setLayouts(prev => prev.filter(l => l.id !== id));
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  return { layouts, isLoading, error, fetchLayouts, fetchLayout, create, update, remove };
}

export default useLayouts;
