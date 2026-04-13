import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import PlotMap from '../../components/PlotMap';
import RevealUp from '../../components/RevealUp';
import SkeletonCard from '../../components/SkeletonCard';
import Toast from '../../components/Toast';

import { useLayouts } from '../../hooks/useLayouts';
import { usePlots } from '../../hooks/usePlots';
import { useToast } from '../../hooks/useToast';

const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const num = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(num) ? num : null;
};

const formatNumberWithCommas = (value) => {
  const num = parseNumber(value);
  if (num === null) return '';
  return new Intl.NumberFormat('en-IN').format(num);
};

export default function LayoutEditor() {
  const { id } = useParams();
  const { fetchLayout } = useLayouts();
  const { create, update, remove } = usePlots();
  const { toast, showToast, hideToast } = useToast();

  const [layout, setLayout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPlot, setSelectedPlot] = useState(null);

  const [formData, setFormData] = useState({
    plot_number: '',
    size_sqft: '',
    price: '',
    facing: 'North',
    status: 'available',
    grid_x: '',
    grid_y: '',
    grid_w: 1,
    grid_h: 1,
  });

  const [errors, setErrors] = useState({});

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLayout(id);
      setLayout(data);
    } catch (e) {
      showToast(e?.message || 'Failed to load layout', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const resetForm = ({ keepGrid = false } = {}) => {
    setSelectedPlot(null);
    setErrors({});
    setFormData((prev) => ({
      plot_number: '',
      size_sqft: '',
      price: '',
      facing: 'North',
      status: 'available',
      grid_x: keepGrid ? prev.grid_x : '',
      grid_y: keepGrid ? prev.grid_y : '',
      grid_w: 1,
      grid_h: 1,
    }));
  };

  const handleEmptyCellClick = (x, y) => {
    setSelectedPlot(null);
    setErrors({});
    setFormData({
      plot_number: '',
      size_sqft: '',
      price: '',
      facing: 'North',
      status: 'available',
      grid_x: x,
      grid_y: y,
      grid_w: 1,
      grid_h: 1,
    });
  };

  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
    setErrors({});
    setFormData({
      plot_number: plot.plot_number || '',
      size_sqft: plot.size_sqft ?? '',
      price: plot.price ?? '',
      facing: plot.facing || 'North',
      status: plot.status || 'available',
      grid_x: plot.grid_x ?? '',
      grid_y: plot.grid_y ?? '',
      grid_w: plot.grid_w ?? 1,
      grid_h: plot.grid_h ?? 1,
    });
  };

  const handleDeletePlot = async (plot) => {
    const ok = window.confirm(`DELETE PLOT ${plot.plot_number}? This cannot be undone.`);
    if (!ok) return;
    try {
      await remove(plot.id);
      showToast('Plot deleted successfully', 'success');
      const fresh = await fetchLayout(id);
      setLayout(fresh);
      resetForm();
    } catch (e) {
      showToast(e?.response?.data?.error || 'Failed to delete plot', 'error');
    }
  };

  const title = useMemo(() => {
    if (!selectedPlot) return 'ADD PLOT';
    return `EDIT PLOT ${selectedPlot.plot_number}`;
  }, [selectedPlot]);

  const validate = () => {
    const next = {};

    if (!formData.plot_number.trim()) next.plot_number = 'Plot number is required.';

    const size = parseNumber(formData.size_sqft);
    if (size === null) next.size_sqft = 'Size is required.';
    if (size !== null && size <= 0) next.size_sqft = 'Size must be > 0.';

    const price = parseNumber(formData.price);
    if (price === null) next.price = 'Price is required.';
    if (price !== null && price <= 0) next.price = 'Price must be > 0.';

    if (formData.grid_x === '' || formData.grid_y === '') {
      next.grid = 'Select a grid position (click on the map).';
    }

    const gx = Number(formData.grid_x);
    const gy = Number(formData.grid_y);
    const gw = Number(formData.grid_w);
    const gh = Number(formData.grid_h);

    if (!Number.isFinite(gx) || !Number.isFinite(gy)) next.grid = 'Invalid grid coordinates.';
    if (!Number.isFinite(gw) || gw <= 0) next.grid_w = 'Grid width must be >= 1.';
    if (!Number.isFinite(gh) || gh <= 0) next.grid_h = 'Grid height must be >= 1.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!layout) return;
    if (!validate()) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    const payload = {
      plot_number: formData.plot_number.trim(),
      size_sqft: parseNumber(formData.size_sqft),
      price: parseNumber(formData.price),
      facing: formData.facing,
      status: formData.status,
      grid_x: Number(formData.grid_x),
      grid_y: Number(formData.grid_y),
      grid_w: Number(formData.grid_w || 1),
      grid_h: Number(formData.grid_h || 1),
    };

    try {
      if (selectedPlot) {
        await update(selectedPlot.id, payload);
        showToast('Plot updated successfully', 'success');
      } else {
        await create({ layout_id: layout.id, ...payload });
        showToast('Plot added successfully', 'success');
      }
      const fresh = await fetchLayout(id);
      setLayout(fresh);
      resetForm();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to save plot', 'error');
    }
  };

  const handleClear = () => {
    // Keep the last selected grid position for faster iteration.
    resetForm({ keepGrid: Boolean(formData.grid_x !== '' && formData.grid_y !== '') });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark md:ml-60 p-12">
        <div className="max-w-7xl mx-auto">
          <SkeletonCard variant="layout" />
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div className="min-h-screen bg-bg-dark md:ml-60 p-12">
        <div className="max-w-4xl mx-auto text-text-light">
          <p className="text-text-muted">Layout not found.</p>
          <Link to="/agent/layouts" className="text-accent-rose mt-4 inline-block">
            Back to layouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      <Sidebar />

      <main className="min-h-screen p-12 md:ml-60">
        <div className="max-w-7xl mx-auto">
          <RevealUp>
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
              <Link
                to="/agent/layouts"
                className="inline-flex items-center gap-2 text-[10px] font-[900] tracking-[0.4em] text-text-muted hover:text-accent-rose transition-colors"
              >
                <ArrowLeft size={14} />
                BACK TO LAYOUTS
              </Link>

              <div className="flex items-center gap-3">
                <span className="utility-label text-accent-rose">MAP EDITOR</span>
                <span className="pill-button">{layout.name}</span>
              </div>
            </div>
          </RevealUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <RevealUp delay={100}>
                <div className="glass-card p-6 md:p-8">
                  <span className="utility-label text-accent-rose block mb-6">PLOT MAP</span>
                  <PlotMap
                    plots={layout.plots || []}
                    isEditor
                    onPlotClick={handlePlotClick}
                    onEmptyCellClick={handleEmptyCellClick}
                    onPlotDelete={handleDeletePlot}
                  />
                </div>
              </RevealUp>
            </div>

            <div className="md:col-span-1">
              <RevealUp delay={200}>
                <div className="glass-card-dark p-6 md:p-8 md:sticky md:top-24">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold uppercase tracking-tight text-text-light">
                        {title}
                      </h2>
                      <p className="text-text-muted text-sm mt-2">
                        Click on the map to set coordinates.
                      </p>
                    </div>
                    {selectedPlot && (
                      <div 
                        className="hidden sm:block text-text-muted cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleDeletePlot(selectedPlot)}
                        title="Delete Plot"
                      >
                        <Trash2 size={18} className="text-accent-red" />
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Plot Number *
                      </label>
                      <input
                        type="text"
                        value={formData.plot_number}
                        onChange={(e) => setFormData((p) => ({ ...p, plot_number: e.target.value }))}
                        className="dark-input w-full"
                        placeholder="A-101"
                        required
                      />
                      {errors.plot_number && (
                        <p className="text-accent-red text-sm mt-1">{errors.plot_number}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                          Size (sq.ft) *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formData.size_sqft}
                          onChange={(e) => setFormData((p) => ({ ...p, size_sqft: e.target.value }))}
                          onBlur={() => {
                            setFormData((p) => ({ ...p, size_sqft: formatNumberWithCommas(p.size_sqft) }));
                          }}
                          className="dark-input w-full"
                          placeholder="2400"
                        />
                        {errors.size_sqft && (
                          <p className="text-accent-red text-sm mt-1">{errors.size_sqft}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                          Price (₹) *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formData.price}
                          onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                          onBlur={() => {
                            setFormData((p) => ({ ...p, price: formatNumberWithCommas(p.price) }));
                          }}
                          className="dark-input w-full"
                          placeholder="4,800,000"
                        />
                        {errors.price && (
                          <p className="text-accent-red text-sm mt-1">{errors.price}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Facing *
                      </label>
                      <select
                        value={formData.facing}
                        onChange={(e) => setFormData((p) => ({ ...p, facing: e.target.value }))}
                        className="dark-input w-full"
                      >
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                        Status *
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, status: 'available' }))}
                          className={`flex-1 py-3 rounded-xl border transition-colors ${
                            formData.status === 'available'
                              ? 'border-accent-green bg-[rgba(34,197,94,0.18)] text-accent-green'
                              : 'border-[rgba(34,197,94,0.35)] bg-transparent text-text-muted'
                          }`}
                        >
                          AVAILABLE
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, status: 'booked' }))}
                          className={`flex-1 py-3 rounded-xl border transition-colors ${
                            formData.status === 'booked'
                              ? 'border-accent-red bg-[rgba(239,68,68,0.18)] text-accent-red'
                              : 'border-[rgba(239,68,68,0.35)] bg-transparent text-text-muted'
                          }`}
                        >
                          BOOKED
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                          Grid X *
                        </label>
                        <input
                          type="number"
                          value={formData.grid_x}
                          onChange={(e) => setFormData((p) => ({ ...p, grid_x: e.target.value }))}
                          className="dark-input w-full"
                          min={0}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                          Grid Y *
                        </label>
                        <input
                          type="number"
                          value={formData.grid_y}
                          onChange={(e) => setFormData((p) => ({ ...p, grid_y: e.target.value }))}
                          className="dark-input w-full"
                          min={0}
                        />
                      </div>
                    </div>

                    {errors.grid && <p className="text-accent-red text-sm">{errors.grid}</p>}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                          Grid W *
                        </label>
                        <input
                          type="number"
                          value={formData.grid_w}
                          onChange={(e) => setFormData((p) => ({ ...p, grid_w: e.target.value }))}
                          className="dark-input w-full"
                          min={1}
                        />
                        {errors.grid_w && <p className="text-accent-red text-sm mt-1">{errors.grid_w}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                          Grid H *
                        </label>
                        <input
                          type="number"
                          value={formData.grid_h}
                          onChange={(e) => setFormData((p) => ({ ...p, grid_h: e.target.value }))}
                          className="dark-input w-full"
                          min={1}
                        />
                        {errors.grid_h && <p className="text-accent-red text-sm mt-1">{errors.grid_h}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <button type="submit" className="pill-button w-full disabled:opacity-50">
                        SAVE PLOT →
                      </button>
                      <button type="button" onClick={handleClear} className="ghost-button w-full">
                        CLEAR FORM
                      </button>
                    </div>
                  </form>
                </div>
              </RevealUp>
            </div>
          </div>
        </div>

        <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />
      </main>
    </div>
  );
}

