import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Grid3X3, Map, Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Sidebar() {
  const { agent, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/agent/login');
  };

  const navItems = [
    { path: '/agent/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { path: '/agent/layouts', label: 'MY LAYOUTS', icon: Map },
    { path: '/agent/bookings', label: 'VISIT REQUESTS', icon: Calendar },
    { path: '/', label: 'VIEW PUBLIC SITE', icon: Grid3X3 },
  ];

  return (
    <>
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-bg-card border border-[rgba(255,255,255,0.08)] text-text-light flex items-center justify-center"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        title="Open menu"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-[rgba(10,10,15,0.7)] backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-bg-card border-r border-[rgba(255,255,255,0.06)] flex flex-col transform transition-transform duration-300 z-50 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
      <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-accent-rose flex items-center justify-center">
            <span className="font-black text-text-dark">PNB</span>
          </div>
          <div>
            <p className="text-[10px] text-text-light tracking-[0.2em] font-bold">PNB DEVELOPER</p>
            <p className="text-[8px] text-accent-rose tracking-[0.4em]">AGENT PORTAL</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-[10px] font-[900] tracking-[0.3em] transition-all duration-300 ${
                    isActive
                      ? 'bg-[rgba(228,164,189,0.08)] text-text-light border-l-2 border-accent-rose'
                      : 'text-[rgba(248,250,252,0.5)] hover:text-accent-rose'
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
        {agent && (
          <div className="mb-4 px-4">
            <p className="text-text-light text-xs font-medium truncate">{agent.name}</p>
            <p className="text-text-muted text-[10px] truncate">{agent.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-[10px] font-[900] tracking-[0.4em] text-accent-rose hover:bg-[rgba(228,164,189,0.08)] w-full transition-colors"
        >
          <LogOut size={16} />
          SIGN OUT
        </button>
      </div>
    </aside>
    </>
  );
}

export default Sidebar;
