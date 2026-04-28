import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import PlotMapSVG from '../../components/PlotMapSVG';
import BookVisitModal from '../../components/BookVisitModal';
import RevealUp from '../../components/RevealUp';
import { useLayouts } from '../../hooks/useLayouts';
import SkeletonCard from '../../components/SkeletonCard';

export function LayoutDetail() {
  const { id } = useParams();
  const { fetchLayout } = useLayouts();
  const [layout, setLayout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadLayout = async () => {
      setIsLoading(true);
      const data = await fetchLayout(id);
      setLayout(data);
      setIsLoading(false);
    };
    loadLayout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePlotClick = (plot) => {
    setSelectedPlot(plot);
    setIsModalOpen(true);
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div className="pt-24 pb-16 px-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-dark">Layout not found</h2>
          <Link to="/" className="text-accent-rose mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-8">
      <div className="max-w-7xl mx-auto">
        <RevealUp>
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-[900] tracking-[0.4em] text-text-muted hover:text-accent-rose transition-colors mb-8">
            <ArrowLeft size={14} />
            HOME &gt; LAYOUTS &gt; <span className="text-accent-rose">{layout.name.toUpperCase()}</span>
          </Link>
        </RevealUp>

        <RevealUp delay={100}>
          <span className="utility-label text-accent-rose">LAYOUT</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-text-dark mt-2">
            {layout.name}
          </h1>
          <div className="flex items-center gap-2 text-text-muted mt-4">
            <MapPin size={16} className="text-accent-rose" />
            {layout.location}
          </div>
          {layout.description && (
            <p className="text-text-muted mt-4 max-w-2xl leading-relaxed">
              {layout.description}
            </p>
          )}
          <div className="flex items-center gap-6 mt-6 font-mono text-sm">
            <span className="text-text-dark">{layout.total_plots || 0} Total</span>
            <span className="text-accent-green">{layout.available_count || 0} Available</span>
            <span className="text-accent-red">{layout.booked_count || 0} Booked</span>
          </div>
        </RevealUp>

        <RevealUp delay={200}>
          <div className="mt-12 glass-card">
            <span className="utility-label text-accent-rose block mb-6">PLOT MAP</span>
            <PlotMapSVG plots={layout.plots} onPlotClick={handlePlotClick} mapImage={layout.map_image} />
            <div className="mt-8 flex items-center gap-6 text-[10px] font-[900] tracking-[0.4em]">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[rgba(34,197,94,0.3)] border border-accent-green"></span>
                AVAILABLE
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[rgba(239,68,68,0.3)] border border-accent-red"></span>
                BOOKED
              </span>
            </div>
          </div>
        </RevealUp>

        <BookVisitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plot={selectedPlot}
          layout={layout}
        />
      </div>
    </div>
  );
}

export default LayoutDetail;
