import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Calendar, User, Phone, Mail } from 'lucide-react';
import { createBooking } from '../api/bookings';

export function BookVisitModal({ isOpen, onClose, plot, layout }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    visit_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await createBooking({
        layout_id: layout.id,
        plot_id: plot.id,
        ...formData
      });
      setIsSuccess(true);
      setFormData({ customer_name: '', customer_email: '', customer_phone: '', visit_date: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(10,10,15,0.7)] backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
            <div className="glass-card-dark w-full p-8 relative shadow-2xl max-h-[85vh] overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-light hover:text-accent-rose transition-colors"
              >
                <X size={24} />
              </button>

              {!isSuccess ? (
                <>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-text-light mb-2">
                    Book A Site Visit
                  </h2>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-accent-rose text-text-dark text-[10px] font-[900] tracking-[0.1em]">
                      {plot?.plot_number}
                    </span>
                    <span className="text-text-muted text-sm">{layout?.name}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          required
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          className="dark-input w-full pl-12"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="email"
                          required
                          value={formData.customer_email}
                          onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                          className="dark-input w-full pl-12"
                          placeholder="your.email@domain.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <div className="absolute left-12 top-1/2 -translate-y-1/2 text-text-muted text-sm">+91</div>
                        <input
                          type="tel"
                          required
                          value={formData.customer_phone}
                          onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                          className="dark-input w-full pl-20"
                          placeholder="99999 99999"
                          maxLength={13}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Preferred Visit Date
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="date"
                          required
                          min={minDate}
                          value={formData.visit_date}
                          onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                          className="dark-input w-full pl-12"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-accent-red text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="pill-button w-full mt-6 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Confirm Visit Request →'}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle size={64} className="text-accent-green mx-auto mb-4" />
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-text-light mb-2">
                    Request Submitted!
                  </h3>
                  <p className="text-text-muted">
                    Our agent will confirm your visit shortly.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setIsSuccess(false);
                    }}
                    className="mt-8 pill-button w-full"
                  >
                    Close Dialog
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BookVisitModal;
