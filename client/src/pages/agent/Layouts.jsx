import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import LayoutCard from '../../components/LayoutCard';
import RevealUp from '../../components/RevealUp';
import { useLayouts } from '../../hooks/useLayouts';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast';

export function Layouts() {
  const { layouts, create, update, remove } = useLayouts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', description: '', cover_image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();

  const handleOpenModal = (layout = null) => {
    if (layout) {
      setEditingLayout(layout);
      setFormData({
        name: layout.name,
        location: layout.location,
        description: layout.description || '',
        cover_image: layout.cover_image || ''
      });
    } else {
      setEditingLayout(null);
      setFormData({ name: '', location: '', description: '', cover_image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingLayout) {
        await update(editingLayout.id, formData);
        showToast('Layout updated successfully', 'success');
      } else {
        await create(formData);
        showToast('Layout created successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditor = (layout) => {
    navigate(`/agent/layouts/${layout.id}/editor`);
  };

  const handleDeleteLayout = async (layout) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete layout "${layout.name}"?`);
    if (!confirmDelete) return;

    try {
      await remove(layout.id);
      showToast('Layout deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete layout', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark">
      <Sidebar />
      <main className="min-h-screen p-12 md:ml-60">
        <RevealUp>
          <span className="utility-label text-accent-rose">MY LAYOUTS</span>
          <h1 className="text-4xl font-bold text-text-light mt-2">Manage Layouts</h1>
        </RevealUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {layouts.map((layout, index) => (
            <motion.div
              key={layout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LayoutCard
                layout={layout}
                variant="dark"
                onEdit={handleOpenModal}
                onEditor={handleEditor}
                onDelete={handleDeleteLayout}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: layouts.length * 0.1 }}
          >
            <div
              onClick={() => handleOpenModal()}
              className="glass-card-dark h-full min-h-[400px] flex flex-col items-center justify-center cursor-pointer border-dashed hover:border-solid hover:border-accent-rose hover:bg-[rgba(228,164,189,0.06)] transition-all"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-accent-rose flex items-center justify-center mb-4">
                <Plus size={24} className="text-accent-rose" />
              </div>
              <span className="text-[10px] font-[900] tracking-[0.4em] text-accent-rose">CREATE LAYOUT</span>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[rgba(10,10,15,0.7)] backdrop-blur-sm z-50"
                onClick={() => setIsModalOpen(false)}
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-lg pointer-events-auto flex flex-col max-h-[95vh]"
                >
                <div className="glass-card-dark w-full p-8 relative overflow-y-auto shadow-2xl">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-text-light hover:text-accent-rose"
                  >
                    <X size={24} />
                  </button>

                  <h2 className="text-2xl font-bold uppercase tracking-tight text-text-light mb-6">
                    {editingLayout ? 'EDIT LAYOUT' : 'NEW LAYOUT'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="dark-input w-full"
                        placeholder="Sunrise Valley"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="dark-input w-full"
                        placeholder="Bangalore"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="dark-input w-full h-24 resize-none"
                        placeholder="Layout description..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Cover Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.cover_image}
                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                        className="dark-input w-full"
                        placeholder="https://..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="pill-button w-full mt-6 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Layout →'}
                    </button>
                  </form>
                </div>
              </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />
    </div>
  );
}

export default Layouts;
