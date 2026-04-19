import { Suspense, lazy } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

const Home = lazy(() => import('./pages/public/Home'));
const LayoutDetail = lazy(() => import('./pages/public/LayoutDetail'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/agent/Login'));
const Dashboard = lazy(() => import('./pages/agent/Dashboard'));
const Layouts = lazy(() => import('./pages/agent/Layouts'));
const LayoutEditor = lazy(() => import('./pages/agent/LayoutEditor'));
const Bookings = lazy(() => import('./pages/agent/Bookings'));

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
          <Suspense fallback={<div className="min-h-screen bg-bg-dark text-text-muted flex items-center justify-center">Loading...</div>}>
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
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {!isAgent && <Footer />}
    </div>
  );
}
