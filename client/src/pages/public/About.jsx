import RevealUp from '../../components/RevealUp';

export default function About() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24 px-8">
      <div className="max-w-7xl mx-auto">
        <RevealUp>
          <span className="utility-label text-accent-rose">ABOUT</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-text-dark mt-2">
            PNB DEVELOPERS
          </h1>
          <p className="text-text-muted mt-6 max-w-3xl leading-relaxed">
            PNB DEVELOPERS curates premium plots and land across prime locations, with a focus on
            clarity, verification, and a smooth buying experience.
          </p>
          <p className="text-text-muted mt-4 max-w-3xl leading-relaxed">
            Every layout is reviewed personally by our team so you can invest with confidence.
          </p>
        </RevealUp>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Verified', desc: 'Personal verification for every plot listing.' },
            { title: 'Premium', desc: 'Premium land and plot offerings in prime areas.' },
            { title: 'Transparent', desc: 'Clear details with smooth site visit requests.' },
          ].map((item) => (
            <RevealUp key={item.title} delay={100}>
              <div className="glass-card p-8">
                <div className="text-accent-rose utility-label mb-3">{item.title}</div>
                <p className="text-text-muted">{item.desc}</p>
              </div>
            </RevealUp>
          ))}
        </div>
      </div>
    </div>
  );
}

