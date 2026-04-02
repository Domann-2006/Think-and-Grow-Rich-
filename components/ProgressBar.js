export default function ProgressBar({ percent = 0, height = 3, className = '' }) {
  return (
    <div
      className={className}
      style={{
        height,
        background: 'var(--bg-elevated)',
        borderRadius: '100px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, percent))}%`,
          height: '100%',
          background: 'linear-gradient(to right, var(--gold-dim), var(--gold))',
          borderRadius: '100px',
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
}
