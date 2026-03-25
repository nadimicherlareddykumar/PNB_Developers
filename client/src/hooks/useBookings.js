import { useState, useEffect, useCallback } from 'react';
import { getBookings, updateBooking } from '../api/bookings';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(null);

  const fetchBookings = useCallback(async (status = null) => {
    try {
      setIsLoading(true);
      setFilter(status);
      const data = await getBookings(status);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const approve = async (id) => {
    const updated = await updateBooking(id, 'approved');
    setBookings(prev => prev.map(b => b.id === id ? updated : b));
    return updated;
  };

  const reject = async (id) => {
    const updated = await updateBooking(id, 'rejected');
    setBookings(prev => prev.map(b => b.id === id ? updated : b));
    return updated;
  };

  return { bookings, isLoading, error, fetchBookings, approve, reject };
}

export default useBookings;
