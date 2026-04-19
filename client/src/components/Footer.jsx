import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-bg-secondary pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-5">
          <h3 className="text-3xl font-black uppercase tracking-tight text-text-dark mb-4">
            PNB DEVELOPERS
          </h3>
          <p className="text-lg italic text-text-muted mb-4">
            Premium Plots. Prime Locations.
          </p>
          <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-sm">
            Discover curated layouts across prime locations. Every plot, personally verified by PNB DEVELOPERS. We help you find your perfect investment in premium real estate.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-text-muted flex gap-2">
              <span className="text-accent-rose font-bold">📍</span> 123 Prime Estate Blvd, Koramangala 5th Block, Bengaluru, Karnataka 560095
            </p>
            <p className="text-sm text-text-muted flex gap-2 items-center">
              <span className="text-accent-rose font-bold">📞</span> 
              <a href="tel:+919876543210" className="hover:text-accent-rose transition-colors">+91 98765 43210</a>
            </p>
            <p className="text-sm text-text-muted flex gap-2 items-center">
              <span className="text-accent-rose font-bold">✉️</span> 
              <a href="mailto:info@pnbdevelopers.com" className="hover:text-accent-rose transition-colors">info@pnbdevelopers.com</a>
            </p>
            <p className="text-sm text-text-muted flex gap-2">
              <span className="text-accent-rose font-bold">🕒</span> Open Daily: 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>

        <div className="col-span-4 md:col-span-2">
          <h4 className="utility-label text-accent-rose mb-6 underline underline-offset-8">Navigate</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-sm text-text-muted hover:text-accent-rose transition-colors">Home</Link></li>
            <li><Link to="/" className="text-sm text-text-muted hover:text-accent-rose transition-colors">Layouts</Link></li>
            <li><Link to="/about" className="text-sm text-text-muted hover:text-accent-rose transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-sm text-text-muted hover:text-accent-rose transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="col-span-4 md:col-span-2">
          <h4 className="utility-label text-accent-rose mb-6 underline underline-offset-8">Connect</h4>
          <ul className="space-y-3">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-rose transition-colors">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-rose transition-colors">Facebook</a></li>
            <li><a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-rose transition-colors">WhatsApp</a></li>
            <li><a href="mailto:info@pnbdevelopers.com" className="text-sm text-text-muted hover:text-accent-rose transition-colors">Email</a></li>
          </ul>
        </div>

        <div className="col-span-4 md:col-span-3">
          <h4 className="utility-label text-accent-rose mb-6 underline underline-offset-8">Locations</h4>
          <ul className="space-y-3">
            <li className="text-sm text-text-muted">Bangalore</li>
            <li className="text-sm text-text-muted">Hyderabad</li>
            <li className="text-sm text-text-muted">Chennai</li>
            <li className="text-sm text-text-muted">Mumbai</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-[rgba(38,38,38,0.08)] flex flex-col md:flex-row justify-between items-center">
        <p className="text-[9px] tracking-[0.1em] text-[rgba(38,38,38,0.3)]">
          © 2025 PNB DEVELOPERS. All Rights Reserved.
        </p>
        <p className="text-[9px] tracking-[0.1em] text-[rgba(38,38,38,0.3)]">
          Privacy Policy · Terms of Service
        </p>
      </div>
    </footer>
  );
}

export default Footer;
