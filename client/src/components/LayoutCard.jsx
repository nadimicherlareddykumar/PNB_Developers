import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import RevealUp from './RevealUp';

export function LayoutCard({ layout, variant = 'default', onEdit, onEditor }) {
  const isDark = variant === 'dark';

  return (
    <RevealUp className={`group relative ${isDark ? 'bg-bg-card' : 'bg-bg-primary'} rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1`}>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl relative">
        <img
          src={layout.cover_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
          alt={layout.name}
          className="w-full h-full object-cover image-grayscale"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-[10px] font-[900] tracking-[0.4em] uppercase">
            VIEW MAP
          </span>
        </div>
        {onEdit && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); onEdit(layout); }}
              className="w-8 h-8 rounded-full bg-bg-card/80 flex items-center justify-center text-text-light hover:bg-accent-rose hover:text-text-dark transition-colors"
            >
              ✏️
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onEditor(layout); }}
              className="w-8 h-8 rounded-full bg-bg-card/80 flex items-center justify-center text-text-light hover:bg-accent-rose hover:text-text-dark transition-colors"
            >
              🗺️
            </button>
          </div>
        )}
      </div>

      <Link to={`/layout/${layout.id}`} className="block p-6">
        <span className="utility-label text-accent-rose">Layout</span>
        <h3 className="text-3xl font-[800] uppercase tracking-tight text-text-dark mt-1 mb-2">
          {layout.name}
        </h3>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <MapPin size={14} className="text-accent-rose" />
          {layout.location}
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-text-muted">
            {layout.total_plots || 0} Total
          </span>
          <span className="text-accent-green">
            {(layout.available_count || 0)} Available
          </span>
          <span className="text-accent-red">
            {(layout.booked_count || 0)} Booked
          </span>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <Link
          to={`/layout/${layout.id}`}
          className="ghost-button inline-block text-[10px]"
        >
          View Map →
        </Link>
      </div>
    </RevealUp>
  );
}

export default LayoutCard;
