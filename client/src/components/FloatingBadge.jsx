export function FloatingBadge({ number, label, className = '' }) {
  return (
    <div className={`absolute -top-8 -right-8 w-40 h-40 rounded-full bg-accent-rose flex flex-col items-center justify-center animate-bounce-slow ${className}`}>
      <span className="text-3xl italic font-serif text-text-dark">{number}</span>
      <span className="text-[8px] font-[900] tracking-[0.4em] uppercase text-text-dark">{label}</span>
    </div>
  );
}

export default FloatingBadge;
