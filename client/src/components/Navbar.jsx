import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'LAYOUTS', path: '/#layouts' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isActiveLink = (linkPath) => {
    // For hash links like `/#layouts`, highlight based on the base pathname.
    if (linkPath.includes('#')) {
      return location.pathname === (linkPath.split('#')[0] || '/');
    }
    return location.pathname === linkPath;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-[rgba(253,248,243,0.8)] backdrop-blur-md border-b border-[rgba(38,38,38,0.05)]">
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
        <Link to="/" className="text-xl font-bold uppercase tracking-[0.2em] text-text-dark">
          PND Developers
        </Link>

        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[10px] font-[900] uppercase tracking-[0.2em] transition-colors duration-300 ${
                isActiveLink(link.path) ? 'text-accent-rose' : 'text-text-dark hover:text-accent-rose'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="tel:+919999999999"
            className="px-6 py-2 border border-accent-rose text-accent-rose hover:bg-accent-rose hover:text-white transition-colors text-[10px] font-[900] tracking-[0.2em] uppercase rounded-full"
          >
            Call Now
          </a>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-text-dark hover:text-accent-rose transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open navigation menu"
          title="Menu"
        >
          <span className="text-text-dark">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-bg-primary z-60 md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-[900] uppercase tracking-[0.2em] text-text-dark"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:+919999999999"
              className="mt-4 px-8 py-3 bg-accent-rose text-white text-[12px] font-[900] tracking-[0.2em] uppercase rounded-full"
            >
              Call Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
