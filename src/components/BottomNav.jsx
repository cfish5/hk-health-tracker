import React from 'react'

const TABS = [
  { id: 'diet', icon: 'bowl', label: 'Diet' },
  { id: 'exercise', icon: 'barbell', label: 'Exercise' },
  { id: 'body', icon: 'ruler', label: 'Body' },
  { id: 'progress', icon: 'chart-line', label: 'Progress' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      display: 'flex', background: 'var(--hk-black)',
      borderTop: '2px solid var(--hk-yellow)',
      position: 'sticky', bottom: 0, zIndex: 10,
      paddingBottom: 'var(--safe-bottom)'
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '10px 4px 12px', fontSize: 10, fontWeight: 500,
            color: active === tab.id ? 'var(--hk-yellow)' : 'var(--hk-muted)',
            border: 'none', background: 'none', cursor: 'pointer'
          }}
          aria-label={tab.label}
        >
          <i className={`ti ti-${tab.icon}`} aria-hidden="true" style={{ fontSize: 21 }} />
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
