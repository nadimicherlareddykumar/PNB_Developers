import { motion } from 'framer-motion';

export function PlotMapSVG({ plots, onPlotClick, isEditor = false, onEmptyCellClick, onPlotDelete, mapImage }) {
  const CELL = 110;
  const PADDING = 60;

  if (!isEditor && (!plots || plots.length === 0)) {
    return (
      <div className="glass-card p-12 text-center text-text-muted italic">
        Our luxury parcels are currently being mapped...
      </div>
    );
  }

  const maxX = Math.max(10, ...plots.map(p => p.grid_x + (p.grid_w || 1)));
  const maxY = Math.max(10, ...plots.map(p => p.grid_y + (p.grid_h || 1)));
  
  const width = maxX * CELL + (PADDING * 2);
  const height = maxY * CELL + (PADDING * 2);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  return (
    <div className="w-full overflow-hidden rounded-[2rem] bg-[#1a1c1e] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[900px] cursor-crosshair"
        onClick={(e) => {
          if (!isEditor) return;
          const svg = e.currentTarget;
          const rect = svg.getBoundingClientRect();
          const x = Math.floor(((e.clientX - rect.left) * (width / rect.width) - PADDING) / CELL);
          const y = Math.floor(((e.clientY - rect.top) * (height / rect.height) - PADDING) / CELL);
          if (x >= 0 && y >= 0) onEmptyCellClick?.(x, y);
        }}>
        
        <defs>
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a2e1a" />
            <stop offset="100%" stopColor="#0f1a0f" />
          </linearGradient>
          <filter id="plotShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" shadowColor="rgba(0,0,0,0.4)" />
          </filter>
          <pattern id="roadPattern" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
             <rect width={CELL} height={CELL} fill="#232527" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* Main Estate Landscape / Background Image */}
        {mapImage ? (
          <image 
            href={mapImage} 
            x="0" y="0" width={width} height={height} 
            preserveAspectRatio="xMidYMid slice" 
            opacity="0.8" 
          />
        ) : (
          <>
            <rect width={width} height={height} fill="url(#grassGrad)" />
            <rect x={PADDING} y={PADDING} width={maxX * CELL} height={maxY * CELL} fill="url(#roadPattern)" opacity="0.5" />
          </>
        )}

        {plots.map((plot, i) => (
          <motion.g
            key={plot.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ y: -2 }}
            className="cursor-pointer"
            filter="url(#plotShadow)"
            onClick={(e) => {
              e.stopPropagation();
              onPlotClick?.(plot);
            }}
          >
            {/* Plot Parcel */}
            <rect
              x={PADDING + (plot.grid_x * CELL) + 6}
              y={PADDING + (plot.grid_y * CELL) + 6}
              width={(plot.grid_w || 1) * CELL - 12}
              height={(plot.grid_h || 1) * CELL - 12}
              rx="12"
              fill={plot.status === 'available' ? 'rgba(45, 160, 90, 0.9)' : 'rgba(180, 60, 60, 0.8)'}
              className="transition-all duration-300"
            />
            
            {/* Texture/Glow Overlay */}
            <rect
              x={PADDING + (plot.grid_x * CELL) + 6}
              y={PADDING + (plot.grid_y * CELL) + 6}
              width={(plot.grid_w || 1) * CELL - 12}
              height={(plot.grid_h || 1) * CELL - 12}
              rx="12"
              fill="url(#grassGrad)"
              fillOpacity="0.2"
            />

            <text
              x={PADDING + (plot.grid_x * CELL) + ((plot.grid_w || 1) * CELL / 2)}
              y={PADDING + (plot.grid_y * CELL) + ((plot.grid_h || 1) * CELL / 2) - 4}
              textAnchor="middle"
              fill="#fff"
              className="text-[15px] font-black tracking-tighter drop-shadow-md"
            >
              {plot.plot_number}
            </text>
            
            {plot.price && (
              <text
                x={PADDING + (plot.grid_x * CELL) + ((plot.grid_w || 1) * CELL / 2)}
                y={PADDING + (plot.grid_y * CELL) + ((plot.grid_h || 1) * CELL / 2) + 18}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.7)"
                className="text-[10px] font-bold tracking-tight"
              >
                {formatPrice(plot.price)}
              </text>
            )}

            {plot.status === 'available' && (
               <circle 
                 cx={PADDING + (plot.grid_x * CELL) + ((plot.grid_w || 1) * CELL) - 20}
                 cy={PADDING + (plot.grid_y * CELL) + 20}
                 r="4"
                 fill="#4ade80"
                 className="animate-pulse"
               />
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default PlotMapSVG;
