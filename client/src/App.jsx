import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/public/Home';
import LayoutDetail from './pages/public/LayoutDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import Login from './pages/agent/Login';
import Dashboard from './pages/agent/Dashboard';
import Layouts from './pages/agent/Layouts';
import LayoutEditor from './pages/agent/LayoutEditor';
import Bookings from './pages/agent/Bookings';

export default function App() {
  const location = useLocation();
  const isAgent = location.pathname.startsWith('/agent');

  return (
    <div className="min-h-screen">
      {!isAgent && <Navbar />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/layout/:id" element={<LayoutDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/agent/login" element={<Login />} />

            <Route
              path="/agent/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/agent/layouts"
              element={
                <PrivateRoute>
                  <Layouts />
                </PrivateRoute>
              }
            />
            <Route
              path="/agent/layouts/:id/editor"
              element={
                <PrivateRoute>
                  <LayoutEditor />
                </PrivateRoute>
              }
            />
            <Route
              path="/agent/bookings"
              element={
                <PrivateRoute>
                  <Bookings />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {!isAgent && <Footer />}
    </div>
  );
}

