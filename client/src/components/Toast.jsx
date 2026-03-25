import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function Toast({ message, type = 'info', isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-accent-green" />,
    error: <XCircle size={20} className="text-accent-red" />,
    info: <Info size={20} className="text-accent-rose" />
  };

  const borderColors = {
    success: 'border-l-accent-green',
    error: 'border-l-accent-red',
    info: 'border-l-accent-rose'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`fixed top-24 right-8 z-50 bg-bg-card rounded-lg p-4 shadow-lg border-l-4 ${borderColors[type]} flex items-center gap-3 max-w-sm`}
        >
          {icons[type]}
          <p className="text-text-light text-sm flex-1">{message}</p>
          <button onClick={onClose} className="text-text-muted hover:text-text-light">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
