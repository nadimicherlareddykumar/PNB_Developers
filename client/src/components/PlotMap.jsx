import { motion } from 'framer-motion';

export function PlotMap({ plots, onPlotClick, isEditor = false, onEmptyCellClick, onPlotDelete }) {
  if (!plots || plots.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-text-muted">No plots available in this layout.</p>
      </div>
    );
  }

  const maxX = Math.max(...plots.map(p => p.grid_x + (p.grid_w || 1)));
  const maxY = Math.max(...plots.map(p => p.grid_y + (p.grid_h || 1)));

  const gridCols = maxX;
  const gridRows = maxY;

  const getPlotAtPosition = (x, y) => {
    return plots.find(plot => 
      x >= plot.grid_x && x < plot.grid_x + (plot.grid_w || 1) &&
      y >= plot.grid_y && y < plot.grid_y + (plot.grid_h || 1)
    );
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div 
      className="grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(80px, 1fr))`,
        gridTemplateRows: `repeat(${gridRows}, minmax(80px, 1fr))`
      }}
    >
      {Array.from({ length: gridRows * gridCols }).map((_, index) => {
        const x = index % gridCols;
        const y = Math.floor(index / gridCols);
        const plot = getPlotAtPosition(x, y);

        // Skip cells already covered by a multi-cell plot rendered from its origin
        if (plot && (x !== plot.grid_x || y !== plot.grid_y)) return null;

        return (
          <motion.div
            key={`${x}-${y}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            style={plot ? {
              gridColumn: `span ${plot.grid_w || 1}`,
              gridRow: `span ${plot.grid_h || 1}`
            } : {}}
          >
            {plot ? (
              <div
                onClick={() => {
                  if (!onPlotClick) return;
                  if (isEditor) return onPlotClick(plot);
                  if (plot.status === 'available') return onPlotClick(plot);
                }}
                className={`
                  group relative
                  h-full min-h-[80px] p-2 rounded-lg flex flex-col justify-center items-center text-center
                  ${plot.status === 'available' ? 'plot-available' : 'plot-booked'}
                  ${(isEditor || plot.status === 'available') ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <span className="font-mono text-[11px] font-bold text-text-dark">
                  {plot.plot_number}
                </span>

                {plot.price && (
                  <span className="font-mono text-[9px] text-text-muted mt-1">
                    {formatPrice(plot.price)}
                  </span>
                )}

                {plot.status === 'booked' && (
                  <span className="text-[8px] font-[900] tracking-[0.1em] text-accent-red mt-1">
                    BOOKED
                  </span>
                )}

                {isEditor && (
                  <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlotClick?.(plot);
                      }}
                      className="w-7 h-7 rounded-full bg-bg-card/80 flex items-center justify-center text-text-light hover:bg-accent-rose hover:text-text-dark transition-colors"
                      aria-label="Edit plot"
                      title="Edit plot"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlotDelete?.(plot);
                      }}
                      className="w-7 h-7 rounded-full bg-bg-card/80 flex items-center justify-center text-text-light hover:bg-accent-red hover:text-text-light transition-colors"
                      aria-label="Delete plot"
                      title="Delete plot"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => isEditor && onEmptyCellClick(x, y)}
                className={`
                  h-full min-h-[80px] rounded-lg border border-dashed flex items-center justify-center
                  ${isEditor 
                    ? 'cursor-pointer border-[rgba(228,164,189,0.3)] hover:border-accent-rose hover:bg-[rgba(228,164,189,0.05)]' 
                    : 'border-transparent'}
                `}
              >
                {isEditor && <span className="text-[8px] text-text-muted">+</span>}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default PlotMap;
