import { MapPin, Phone } from 'lucide-react';
import RevealUp from '../../components/RevealUp';

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24 px-8">
      <div className="max-w-7xl mx-auto">
        <RevealUp>
          <span className="utility-label text-accent-rose">CONTACT</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-text-dark mt-2">
            Let&apos;s Schedule a Visit
          </h1>
          <p className="text-text-muted mt-6 max-w-3xl leading-relaxed">
            Explore layouts and click any available plot to request a site visit. Our agent will confirm
            your request shortly.
          </p>
        </RevealUp>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RevealUp delay={100}>
            <div className="glass-card p-10">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-accent-rose" />
                <p className="utility-label text-accent-rose">LOCATIONS</p>
              </div>
              <p className="text-text-muted mt-4">Bangalore · Hyderabad · Chennai · Mumbai</p>
            </div>
          </RevealUp>

          <RevealUp delay={200}>
            <div className="glass-card p-10">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-accent-rose" />
                <p className="utility-label text-accent-rose">PHONE</p>
              </div>
              <a href="tel:+919999999999" className="text-accent-rose block mt-4 font-[900] tracking-[0.1em]">
                +91 99999 99999
              </a>
              <p className="text-text-muted mt-4">Call us for layout availability and visit scheduling.</p>
            </div>
          </RevealUp>
        </div>
      </div>
    </div>
  );
}

