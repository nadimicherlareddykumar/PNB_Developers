import React, { useEffect, useRef, useState } from 'react';

export function TubesBackground({ children, className = '', enableClickInteraction = true }) {
  const canvasRef = useRef(null);
  const tubesRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!canvasRef.current) return;

      try {
        const module = await import(
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        if (!mounted) return;

        const app = module.default(canvasRef.current, {
          tubes: {
            colors: ["#e4a4bd", "#262626", "#f5f0eb"],
            lights: {
              intensity: 200,
              colors: ["#e4a4bd", "#f59e0b", "#262626", "#fdf8f3"]
            }
          }
        });
        tubesRef.current = app;
      } catch (e) {
        console.error('Tubes init failed:', e);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    const rand = (n) => Array.from({ length: n }, () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    tubesRef.current.tubes.setColors(rand(3));
    tubesRef.current.tubes.setLightsColors(rand(4));
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-[#0a0a0f] ${className}`} 
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
        style={{ touchAction: 'none' }} 
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
