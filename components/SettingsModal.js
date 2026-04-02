import { useEffect, useRef } from 'react';

export default function SettingsModal({ visible, onClose, fontSize, lineHeight, onFontSize, onLineHeight }) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (visible) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  if (!visible) return null;

  const Btn = ({ onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        width: 30, height: 30,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        fontFamily: 'DM Sans, sans-serif',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-subtle)'; e.currentTarget.style.color = 'var(--gold)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >{children}</button>
  );

  const Label = ({ children }) => (
    <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.6rem' }}>
      {children}
    </div>
  );

  const Val = ({ children }) => (
    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', minWidth: 28, textAlign: 'center' }}>{children}</span>
  );

  const Divider = () => <div style={{ height: 1, background: 'var(--divider)', margin: '0.75rem 0' }} />;

  return (
    <div
      ref={ref}
      className="settings-panel"
      style={{
        position: 'fixed',
        right: '5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '1.25rem',
        width: 200,
        zIndex: 88,
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <Label>Font Size</Label>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>A</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Btn onClick={() => onFontSize(Math.max(14, fontSize - 1))}>−</Btn>
          <Val>{fontSize}</Val>
          <Btn onClick={() => onFontSize(Math.min(28, fontSize + 1))}>+</Btn>
        </div>
        <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>A</span>
      </div>

      <Divider />

      <Label>Line Spacing</Label>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>≡</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Btn onClick={() => onLineHeight(Math.max(1.4, parseFloat((lineHeight - 0.1).toFixed(1))))}>−</Btn>
          <Val>{lineHeight.toFixed(1)}</Val>
          <Btn onClick={() => onLineHeight(Math.min(2.8, parseFloat((lineHeight + 0.1).toFixed(1))))}>+</Btn>
        </div>
        <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>≡</span>
      </div>

      <Divider />

      <Label>Font Style</Label>
      <div style={{ display: 'flex', gap: 6 }}>
        {['Serif', 'Sans'].map(f => (
          <button key={f} style={{
            flex: 1, padding: '0.3rem', borderRadius: 6, border: '1px solid var(--border-subtle)',
            background: f === 'Serif' ? 'var(--gold-subtle)' : 'var(--bg-card)',
            color: f === 'Serif' ? 'var(--gold)' : 'var(--text-muted)',
            fontSize: '0.72rem', cursor: 'pointer', fontFamily: f === 'Serif' ? 'Cormorant Garamond, serif' : 'DM Sans, sans-serif',
          }}>{f}</button>
        ))}
      </div>
    </div>
  );
}
