export function StatusBadge({ status }) {
  const styles = {
    pending: {
      bg: 'rgba(228, 164, 189, 0.15)',
      color: '#e4a4bd',
      text: 'PENDING'
    },
    approved: {
      bg: 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
      text: 'APPROVED'
    },
    rejected: {
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
      text: 'REJECTED'
    },
    available: {
      bg: 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
      text: 'AVAILABLE'
    },
    booked: {
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
      text: 'BOOKED'
    }
  };

  const style = styles[status] || styles.pending;

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-[900] tracking-[0.2em] uppercase"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {style.text}
    </span>
  );
}

export default StatusBadge;
