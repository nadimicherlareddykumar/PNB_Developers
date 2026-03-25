import { useState } from 'react';
import { createPlot, updatePlot, deletePlot } from '../api/plots';

export function usePlots() {
  const [isLoading, setIsLoading] = useState(false);

  const create = async (data) => {
    setIsLoading(true);
    try {
      return await createPlot(data);
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id, data) => {
    setIsLoading(true);
    try {
      return await updatePlot(id, data);
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id) => {
    setIsLoading(true);
    try {
      await deletePlot(id);
    } finally {
      setIsLoading(false);
    }
  };

  return { create, update, remove, isLoading };
}

export default usePlots;
