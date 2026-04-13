import { Link } from 'react-router-dom';
import { MapPin, Trash2 } from 'lucide-react';
import RevealUp from './RevealUp';

export function LayoutCard({ layout, variant = 'default', onEdit, onEditor, onDelete }) {
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
            {onDelete && (
              <button
                onClick={(e) => { e.preventDefault(); onDelete(layout); }}
                className="w-8 h-8 rounded-full bg-bg-card/80 flex items-center justify-center text-text-light border border-transparent hover:border-accent-red hover:bg-transparent hover:text-accent-red transition-all"
                title="Delete Layout"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <Link to={`/layout/${layout.id}`} className="block p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="utility-label text-accent-rose !mb-0">Layout</span>
          <span className="px-2 py-1 bg-accent-green/10 text-accent-green text-[9px] font-bold tracking-wider rounded-sm border border-accent-green/20">
            RERA APPROVED
          </span>
        </div>
        <h3 className="text-3xl font-[800] uppercase tracking-tight text-text-dark mt-1 mb-2">
          {layout.name}
        </h3>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <MapPin size={14} className="text-accent-rose" />
          {layout.location}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Plots</span>
            <div className="flex items-center gap-2 text-xs font-mono mt-1">
              <span className="text-accent-green">{(layout.available_count || 0)} Avail</span>
              <span className="text-text-muted">/</span>
              <span className="text-text-muted">{layout.total_plots || 0} Total</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Size Range</span>
            <span className="text-xs font-mono mt-1 text-text-dark">
              {layout.min_size ? `${layout.min_size} - ${layout.max_size} sq.ft` : 'Varies'}
            </span>
          </div>
        </div>
        
        {layout.starting_price && (
          <div className="pt-4 border-t border-[rgba(38,38,38,0.05)]">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold inline-block mr-2">Starts From</span>
            <span className="text-xl font-bold text-accent-rose">₹{(layout.starting_price / 100000).toFixed(2)} L</span>
          </div>
        )}
      </Link>

      <div className="px-6 pb-6 flex gap-3">
        <Link
          to={`/layout/${layout.id}`}
          className="flex-1 text-center py-3 bg-[rgba(38,38,38,0.03)] hover:bg-[rgba(38,38,38,0.08)] text-text-dark text-[11px] font-[900] tracking-[0.2em] uppercase rounded-lg transition-colors border border-[rgba(38,38,38,0.1)]"
        >
          View Details
        </Link>
        <a
          href={`https://wa.me/919876543210?text=I am interested in ${layout.name} located at ${layout.location}. Please share more details.`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center py-3 bg-accent-rose hover:bg-[#d84b5b] text-white text-[11px] font-[900] tracking-[0.2em] uppercase rounded-lg transition-colors"
        >
          Enquire
        </a>
      </div>
    </RevealUp>
  );
}

export default LayoutCard;
