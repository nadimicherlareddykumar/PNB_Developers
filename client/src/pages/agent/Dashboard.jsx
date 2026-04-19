import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid3X3, Map, CheckCircle, Calendar } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import RevealUp from '../../components/RevealUp';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useLayouts } from '../../hooks/useLayouts';
import { useBookings } from '../../hooks/useBookings';
import SkeletonCard from '../../components/SkeletonCard';

export function Dashboard() {
  const { agent } = useAuth();
  const { layouts } = useLayouts();
  const { bookings } = useBookings();

  const totalPlots = layouts.reduce((sum, l) => sum + (l.total_plots || 0), 0);
  const availablePlots = layouts.reduce((sum, l) => sum + (l.available_count || 0), 0);
  const pendingVisits = bookings.filter(b => b.status === 'pending').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const stats = [
    { label: 'TOTAL LAYOUTS', value: layouts.length, icon: Map, color: 'text-accent-rose' },
    { label: 'TOTAL PLOTS', value: totalPlots, icon: Grid3X3, color: 'text-text-light' },
    { label: 'AVAILABLE', value: availablePlots, icon: CheckCircle, color: 'text-accent-green' },
    { label: 'PENDING VISITS', value: pendingVisits, icon: Calendar, color: 'text-accent-rose' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark">
      <Sidebar />
      <main className="min-h-screen p-12 md:ml-60">
        <RevealUp>
          <span className="utility-label text-accent-rose">DASHBOARD</span>
          <h1 className="text-4xl font-bold text-text-light mt-2">
            {getGreeting()}, {agent?.name?.split(' ')[0]}
          </h1>
        </RevealUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="glass-card-dark p-6">
                <div className={`w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <motion.p
                  className="text-3xl font-bold text-text-light font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-[10px] font-[900] tracking-[0.4em] text-text-muted mt-2">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Plot Status Overview */}
          <div className="lg:col-span-2 glass-card-dark p-8">
            <h2 className="text-lg font-bold text-text-light tracking-tight mb-8">PLOT STATUS OVERVIEW</h2>
            <div className="space-y-8">
              {layouts.slice(0, 3).map((layout) => {
                const percentage = (layout.available_count / layout.total_plots) * 100;
                return (
                  <div key={layout.id}>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-text-light font-bold text-sm tracking-tight">{layout.name}</p>
                        <p className="text-text-muted text-[10px] tracking-widest uppercase">{layout.location}</p>
                      </div>
                      <p className="text-accent-rose font-mono text-sm">{layout.available_count} / {layout.total_plots} FREE</p>
                    </div>
                    <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-accent-rose"
                      />
                    </div>
                  </div>
                );
              })}
              {layouts.length > 3 && (
                <Link to="/agent/layouts" className="block text-center text-text-muted text-[10px] font-bold tracking-[0.2em] hover:text-accent-rose transition-colors">
                  VIEW MORE LAYOUTS →
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card-dark p-8">
            <h2 className="text-lg font-bold text-text-light tracking-tight mb-8">QUICK ACTIONS</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'NEW LAYOUT', href: '/agent/layouts', icon: Map },
                { label: 'VIEW VISITS', href: '/agent/bookings', icon: Calendar },
                { label: 'EDIT PLOTS', href: '/agent/layouts', icon: Grid3X3 },
                { label: 'PUBLIC VIEW', href: '/', icon: CheckCircle },
              ].map((action) => (
                <Link 
                  key={action.label}
                  to={action.href}
                  className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl flex flex-col items-center justify-center hover:bg-accent-rose/10 hover:border-accent-rose/30 transition-all group"
                >
                  <action.icon className="text-text-muted group-hover:text-accent-rose mb-3" size={20} />
                  <span className="text-[9px] font-black tracking-widest text-text-muted group-hover:text-text-light text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <RevealUp delay={300}>
          <div className="glass-card-dark p-8 mt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-text-light tracking-tight">RECENT VISITS</h2>
              <Link to="/agent/bookings" className="text-accent-rose text-[10px] font-[900] tracking-[0.2em]">
                VIEW ALL →
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="text-text-muted text-center py-8">No visit requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.1)]">
                      <th className="text-left text-[10px] font-[900] tracking-[0.2em] text-text-muted py-3">CUSTOMER</th>
                      <th className="text-left text-[10px] font-[900] tracking-[0.2em] text-text-muted py-3">PLOT</th>
                      <th className="text-left text-[10px] font-[900] tracking-[0.2em] text-text-muted py-3">LAYOUT</th>
                      <th className="text-left text-[10px] font-[900] tracking-[0.2em] text-text-muted py-3">DATE</th>
                      <th className="text-left text-[10px] font-[900] tracking-[0.2em] text-text-muted py-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="border-b border-[rgba(255,255,255,0.05)]">
                        <td className="py-4">
                          <p className="text-text-light font-medium">{booking.customer_name}</p>
                          <p className="text-text-muted text-xs">{booking.customer_phone}</p>
                        </td>
                        <td className="py-4">
                          <span className="font-mono text-sm text-text-light">{booking.plot_number}</span>
                        </td>
                        <td className="py-4">
                          <p className="text-text-light text-sm">{booking.layout_name}</p>
                          <p className="text-text-muted text-xs">{booking.layout_location}</p>
                        </td>
                        <td className="py-4">
                          <span className="text-text-light text-sm">{formatDate(booking.visit_date)}</span>
                        </td>
                        <td className="py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </RevealUp>

        <Link
          to="/agent/layouts"
          className="fixed bottom-8 right-8 pill-button"
        >
          + NEW LAYOUT
        </Link>
      </main>
    </div>
  );
}

export default Dashboard;
