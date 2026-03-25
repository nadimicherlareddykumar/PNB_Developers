import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import SkeletonCard from '../../components/SkeletonCard';
import Toast from '../../components/Toast';
import RevealUp from '../../components/RevealUp';

import { useBookings } from '../../hooks/useBookings';
import { useToast } from '../../hooks/useToast';

const parseYMD = (dateStr) => {
  if (!dateStr) return null;
  const parts = String(dateStr).split('-');
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const isTomorrow = (dateStr) => {
  const d = parseYMD(dateStr);
  if (!d) return false;

  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
};

const formatDate = (dateStr) => {
  const d = parseYMD(dateStr);
  if (!d) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Bookings() {
  const { bookings, isLoading, fetchBookings, approve, reject } = useBookings();
  const { toast, showToast, hideToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');

  const statusTabs = useMemo(
    () => [
      { key: 'all', label: 'ALL', status: null },
      { key: 'pending', label: 'PENDING', status: 'pending' },
      { key: 'approved', label: 'APPROVED', status: 'approved' },
      { key: 'rejected', label: 'REJECTED', status: 'rejected' },
    ],
    []
  );

  const tabStatus = useMemo(() => {
    const match = statusTabs.find((t) => t.key === activeTab);
    return match ? match.status : null;
  }, [activeTab, statusTabs]);

  useEffect(() => {
    fetchBookings(tabStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabStatus]);

  return (
    <div className="min-h-screen bg-bg-dark">
      <Sidebar />
      <main className="p-12 md:ml-60 min-h-screen">
        <RevealUp>
          <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
            <div>
              <span className="utility-label text-accent-rose">VISIT REQUESTS</span>
              <h1 className="text-4xl font-bold text-text-light mt-2">Requests</h1>
              <p className="text-text-muted text-sm mt-2">
                {bookings.length} request{bookings.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {statusTabs.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full border transition-colors text-[10px] font-[900] tracking-[0.2em] ${
                    active
                      ? 'bg-accent-rose text-text-dark border-accent-rose'
                      : 'bg-transparent border-accent-rose text-text-muted hover:text-accent-rose'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </RevealUp>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 rounded-2xl bg-[rgba(228,164,189,0.10)] flex items-center justify-center mb-4">
              <Calendar className="text-accent-rose" size={28} />
            </div>
            <div className="utility-label text-accent-rose">NO VISIT REQUESTS YET</div>
            <p className="text-text-muted mt-3 max-w-md">
              When a customer submits a booking request, it will appear here for approval.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const tomorrow = isTomorrow(booking.visit_date);
              return (
                <RevealUp key={booking.id}>
                  <div className="glass-card-dark p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-text-light font-bold">{booking.customer_name}</p>
                        <a
                          href={`tel:${booking.customer_phone}`}
                          className="text-accent-rose text-sm block mt-1"
                        >
                          {booking.customer_phone}
                        </a>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-[rgba(228,164,189,0.10)] text-accent-rose font-mono text-[11px] font-bold">
                        PLOT {booking.plot_number}
                      </span>
                      <div className="text-text-muted text-sm">
                        <p className="text-text-light">
                          {booking.layout_name}
                        </p>
                        <p className="text-text-muted">{booking.layout_location}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-text-muted text-sm">
                      <Calendar size={16} className="text-accent-rose" />
                      <span className={tomorrow ? 'text-accent-rose font-bold' : 'text-text-light'}>
                        {tomorrow ? 'TOMORROW' : formatDate(booking.visit_date)}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      {booking.status === 'pending' && (
                        <motion.div
                          key={`${booking.id}-${booking.status}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="mt-6 flex gap-3"
                        >
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await approve(booking.id);
                                showToast(`✓ Approved! SMS sent to ${booking.customer_name}`, 'success');
                              } catch (e) {
                                showToast(e?.response?.data?.error || 'Approval failed', 'error');
                              }
                            }}
                            className="flex-1 pill-button"
                            style={{ background: '#22c55e', color: '#262626' }}
                          >
                            ✓ APPROVE
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await reject(booking.id);
                                showToast('Visit request rejected.', 'info');
                              } catch (e) {
                                showToast(e?.response?.data?.error || 'Rejection failed', 'error');
                              }
                            }}
                            className="flex-1 ghost-button"
                            style={{ borderColor: '#ef4444', color: '#ef4444' }}
                          >
                            ✗ REJECT
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </RevealUp>
              );
            })}
          </div>
        )}

        <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />
      </main>
    </div>
  );
}

