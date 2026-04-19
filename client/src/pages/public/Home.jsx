import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Map, Phone, MessageSquare, CheckCircle, Award, TrendingUp, FileText, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen relative pb-20 md:pb-0">
      {/* --- HERO SECTION --- */}
      <TubesBackground className="h-screen relative">
        <div className="h-full grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center pl-[6vw] md:pl-[8vw] pr-6 md:pr-8 pt-20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={itemVariants} className="inline-block py-1 px-3 bg-accent-rose/10 text-accent-rose text-[10px] font-bold tracking-widest uppercase rounded-full mb-6 border border-accent-rose/20">
                100% Clear Title Plots
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="text-[12vw] md:text-[8vw] leading-[0.9] font-black uppercase tracking-tighter text-text-light"
              >
                SECURE YOUR
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-[10vw] md:text-[7vw] leading-[0.9] font-black italic lowercase tracking-tighter text-accent-rose"
              >
                future in land
              </motion.p>
              
              <motion.p 
                variants={itemVariants}
                className="mt-8 text-lg text-[rgba(248,250,252,0.8)] max-w-lg leading-relaxed font-medium"
              >
                Invest in premium, correctly documented, and strategically located plots. Fast-appreciating lands verified personally by our legal team.
              </motion.p>
              
              <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:+919876543210"
                  className="px-8 py-4 bg-accent-rose text-white text-[12px] font-black uppercase tracking-widest rounded-lg hover:bg-[#d84b5b] transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  Book Site Visit
                </a>
                <a 
                  href="#layouts"
                  className="px-8 py-4 bg-[rgba(255,255,255,0.1)] text-white text-[12px] font-black uppercase tracking-widest rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition-colors border border-[rgba(255,255,255,0.2)] text-center backdrop-blur-md"
                >
                  Explore Layouts
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center justify-end pr-[8vw]">
            <div className="relative">
              <div className="w-[360px] h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)]">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  alt="Premium Layout"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold text-xl uppercase tracking-wider mb-2">Prime Bangalore Layouts</p>
                  <p className="text-accent-green font-mono text-sm tracking-widest">RERA APPROVED</p>
                </div>
              </div>
              <FloatingBadge number="12" label="ACTIVE PROJECTS" />
            </div>
          </div>
        </div>
        
        {/* Trust Badges - Absolute Bottom of Hero */}
        <div className="absolute bottom-0 left-0 right-0 hidden md:block bg-bg-primary/95 backdrop-blur-md border-t border-[rgba(38,38,38,0.05)]">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            {[
              { icon: ShieldCheck, text: "Govt. Approved Limits" },
              { icon: FileText, text: "100% Clear Titles" },
              { icon: Map, text: "Prime Locations" },
              { icon: Award, text: "Trusted by 500+ Families" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="text-accent-rose w-6 h-6" />
                <span className="text-sm font-bold text-text-dark tracking-wide uppercase">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </TubesBackground>

      {/* --- MOBILE TRUST BADGES --- */}
      <div className="md:hidden bg-bg-primary border-b border-[rgba(38,38,38,0.05)] py-6 px-6 grid grid-cols-2 gap-4">
         {[
            { icon: ShieldCheck, text: "Govt. Approved Limits" },
            { icon: FileText, text: "100% Clear Titles" },
            { icon: Map, text: "Prime Locations" },
            { icon: Award, text: "Trusted Developer" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 bg-bg-secondary rounded-lg text-center">
              <item.icon className="text-accent-rose w-6 h-6 mb-2" />
              <span className="text-[10px] font-bold text-text-dark tracking-wide uppercase">{item.text}</span>
            </div>
        ))}
      </div>

      {/* --- WHY CHOOSE US --- */}
      <section className="bg-bg-primary py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <RevealUp className="mb-16 text-center">
            <span className="utility-label text-accent-rose">THE PNB ADVANTAGE</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-text-dark mt-4">
              WHY INVEST WITH US?
            </h2>
          </RevealUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Transparency & Trust", desc: "No hidden charges. We give you full access to land documents and legal opinions before you pay a dime." },
              { title: "High Appreciation Areas", desc: "We acquire lands in upcoming growth corridors ensuring your investment multiplies rapidly." },
              { title: "Hassle-Free Registration", desc: "From booking to final registration, our legal team handles all paperwork to guarantee peace of mind." }
            ].map((item, i) => (
              <RevealUp key={i} className="bg-bg-secondary p-8 rounded-2xl border border-[rgba(38,38,38,0.03)] hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-accent-rose/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="text-accent-rose" size={24} />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-text-dark mb-3">{item.title}</h3>
                <p className="text-text-muted leading-relaxed">{item.desc}</p>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* --- LAYOUTS SECTION --- */}
      <section id="layouts" className="bg-bg-secondary py-32 px-6 md:px-8 border-y border-[rgba(38,38,38,0.05)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <RevealUp>
              <span className="utility-label text-accent-rose">FEATURED PROJECTS</span>
              <h2 className="text-[3rem] md:text-[5rem] leading-[0.9] font-black uppercase tracking-tighter text-text-dark mt-2">
                PREMIUM <span className="italic lowercase text-accent-rose">layouts</span>
              </h2>
            </RevealUp>
            <RevealUp>
              <p className="text-text-muted max-w-md pb-2">
                Explore our curated collection of verified plots. Ready for immediate registration and construction.
              </p>
            </RevealUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} variant="layout" />
              ))
            ) : (
              layouts.slice(0, 6).map((layout) => (
                <LayoutCard key={layout.id} layout={layout} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- LOCATION ADVANTAGES --- */}
      <section className="bg-bg-primary py-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <RevealUp className="w-full md:w-1/2">
            <img src="https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=800" alt="Bangalore Estate" className="w-full rounded-2xl shadow-xl grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="mt-4 flex gap-4">
              <div className="flex-1 bg-bg-secondary p-4 rounded-xl border border-[rgba(38,38,38,0.05)]">
                <p className="text-3xl font-black text-accent-rose">12+</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted mt-1">Prime Locations</p>
              </div>
              <div className="flex-1 bg-bg-secondary p-4 rounded-xl border border-[rgba(38,38,38,0.05)]">
                <p className="text-3xl font-black text-accent-green">500+</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-text-muted mt-1">Happy buyers</p>
              </div>
            </div>
          </RevealUp>
          
          <div className="w-full md:w-1/2">
            <RevealUp>
              <span className="utility-label text-accent-rose">STRATEGIC CHOICES</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-text-dark mt-4 mb-6">
                GROWTH CORRIDORS
              </h2>
              <p className="text-text-muted mb-8 leading-relaxed">
                We don't just sell land; we sell High-Growth Investment Assets. Our layouts are strategically chosen near upcoming IT Parks, Highways, and Industrial Corridors across Bangalore, Hyderabad, Chennai, and Mumbai.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Proximity to National Highways",
                  "Upcoming Metro & Railway Connectivity",
                  "Surrounded by Schools, Hospitals & Commercial Hubs",
                  "High ROI Track Record in previous projects"
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <TrendingUp className="text-accent-rose mt-1 shrink-0" size={18} />
                    <span className="text-text-dark font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="bg-bg-dark py-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <RevealUp className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text-light mb-4 text-center">
              CLIENT STORIES
            </h2>
            <p className="text-[rgba(248,250,252,0.6)]">Hear from families who have secured their future with us.</p>
          </RevealUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RevealUp className="p-10 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl relative">
              <span className="absolute top-6 left-6 text-6xl text-[rgba(255,255,255,0.05)] font-serif">"</span>
              <p className="text-text-light text-lg leading-relaxed relative z-10 italic mb-6">
                "Investing in the North Bangalore layout was the best decision. The legal team at PNB DEVELOPERS was completely transparent, and the registration process was seamless. I highly recommend them."
              </p>
              <div className="flex items-center gap-2 border-t border-[rgba(255,255,255,0.1)] pt-4">
                <div className="w-10 h-10 bg-accent-rose text-white rounded-full flex items-center justify-center font-bold">R</div>
                <div>
                  <p className="text-text-light font-bold">Ramesh Kumar</p>
                  <p className="text-[10px] uppercase tracking-widest text-[rgba(248,250,252,0.5)]">IT Professional</p>
                </div>
              </div>
            </RevealUp>
            
            <RevealUp className="p-10 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl relative">
              <span className="absolute top-6 left-6 text-6xl text-[rgba(255,255,255,0.05)] font-serif">"</span>
              <p className="text-text-light text-lg leading-relaxed relative z-10 italic mb-6">
                "As a first-time land buyer, I was skeptical. PND gave me all documents up front, showed the original approvals, and answered every query. Their layouts are premium and secure."
              </p>
              <div className="flex items-center gap-2 border-t border-[rgba(255,255,255,0.1)] pt-4">
                <div className="w-10 h-10 bg-accent-rose text-white rounded-full flex items-center justify-center font-bold">P</div>
                <div>
                  <p className="text-text-light font-bold">Priya Sharma</p>
                  <p className="text-[10px] uppercase tracking-widest text-[rgba(248,250,252,0.5)]">Business Owner</p>
                </div>
              </div>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="bg-accent-rose py-24 px-6 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
            READY TO MAKE A SMART INVESTMENT?
          </h2>
          <p className="text-[rgba(255,255,255,0.8)] text-xl mb-10 max-w-2xl mx-auto">
            Schedule a free site visit today. We provide transportation and a complete walkthrough of all documents.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="px-10 py-5 bg-white text-accent-rose text-sm font-black uppercase tracking-widest rounded-full hover:bg-bg-primary transition-colors flex items-center justify-center gap-3 shadow-2xl"
            >
              <MessageSquare size={18} />
              Chat on WhatsApp
            </a>
            <a 
              href="tel:+919876543210"
              className="px-10 py-5 bg-transparent border-2 border-white text-white text-sm font-black uppercase tracking-widest rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center justify-center gap-3"
            >
              <Phone size={18} />
              Call +91 98765 43210
            </a>
          </div>
        </div>
      </section>

      {/* --- STICKY MOBILE BOTTOM BAR --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(38,38,38,0.1)] p-3 flex gap-2 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <a href="tel:+919876543210" className="flex-1 flex flex-col items-center justify-center py-2 bg-[rgba(38,38,38,0.04)] rounded-lg text-text-dark hover:bg-[rgba(38,38,38,0.08)]">
          <Phone size={20} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Call</span>
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center justify-center py-2 bg-[rgba(37,211,102,0.1)] text-[#25D366] rounded-lg hover:bg-[rgba(37,211,102,0.2)]">
          <MessageSquare size={20} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>
        <a href="tel:+919876543210" className="flex-[1.5] flex flex-col items-center justify-center py-2 bg-accent-rose text-white rounded-lg shadow-lg">
          <Map size={20} className="mb-1" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Book Visit</span>
        </a>
      </div>

    </div>
  );
}

export default Home;
