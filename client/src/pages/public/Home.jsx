import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TubesBackground from '../../components/TubesBackground';
import LayoutCard from '../../components/LayoutCard';
import RevealUp from '../../components/RevealUp';
import FloatingBadge from '../../components/FloatingBadge';
import SkeletonCard from '../../components/SkeletonCard';
import { useLayouts } from '../../hooks/useLayouts';

export function Home() {
  const { layouts, isLoading } = useLayouts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <TubesBackground className="h-screen">
        <div className="h-full grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center pl-[8vw] pr-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-text-light"
              >
                PREMIUM
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-[12vw] leading-[0.85] font-black italic lowercase tracking-tighter text-accent-rose"
              >
                plots &
              </motion.p>
              <motion.h1 
                variants={itemVariants}
                className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-text-light"
              >
                LAND
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="mt-6 text-lg text-[rgba(248,250,252,0.7)] max-w-md leading-relaxed"
              >
                Discover curated layouts across prime locations. Every plot, personally verified by PND Developers.
              </motion.p>
              
              <motion.a 
                variants={itemVariants}
                href="#layouts"
                className="inline-block mt-10 text-[10px] font-[900] tracking-[0.4em] text-text-light border-b-2 border-accent-rose pb-1 hover:text-accent-rose transition-colors"
              >
                EXPLORE LAYOUTS →
              </motion.a>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center justify-end pr-[8vw]">
            <div className="relative">
              <div className="w-[320px] h-[420px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  alt="Premium Layout"
                  className="w-full h-full object-cover image-grayscale"
                />
              </div>
              <FloatingBadge number="01" label="LAYOUTS" />
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] text-[rgba(248,250,252,0.3)] pointer-events-none">
                MOVE CURSOR · CLICK TO CHANGE COLORS
              </p>
            </div>
          </div>
        </div>
      </TubesBackground>

      <section id="layouts" className="bg-bg-primary py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <RevealUp>
            <span className="utility-label text-accent-rose">OUR LAYOUTS</span>
            <h2 className="text-[8xl] leading-[0.8] font-black uppercase tracking-tighter text-text-dark mt-2">
              FIND YOUR <span className="italic lowercase text-accent-rose">perfect plot</span>
            </h2>
            <p className="text-text-muted mt-6 max-w-xl">
              Explore our curated collection of premium layouts in prime locations. Each plot is verified for clear titles and development potential.
            </p>
          </RevealUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-16">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={i % 2 === 1 ? 'md:mt-24' : ''}>
                  <SkeletonCard variant="layout" />
                </div>
              ))
            ) : (
              layouts.map((layout, index) => (
                <div key={layout.id} className={index % 2 === 1 ? 'md:mt-24' : ''}>
                  <LayoutCard layout={layout} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
