import React, { useState } from 'react'

export function Section({ icon, title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: 'var(--hk-card)', border: '0.5px solid var(--hk-border)',
      borderRadius: 10, marginBottom: 12, overflow: 'hidden'
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '11px 14px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '0.5px solid var(--hk-border)',
          cursor: 'pointer', background: 'var(--hk-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13, color: 'var(--hk-yellow)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <i className={`ti ti-${icon}`} aria-hidden="true" style={{ fontSize: 17 }} />
          {title}
        </div>
        <i className="ti ti-chevron-down" aria-hidden="true" style={{ fontSize: 15, color: 'var(--hk-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>
      {open && <div style={{ padding: '12px 14px' }}>{children}</div>}
    </div>
  )
}

export function FormRow({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <label style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>}
      {children}
    </div>
  )
}

export function RatingRow({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1, minWidth: 56, padding: '7px 4px', fontSize: 12,
            border: `0.5px solid ${value === opt ? 'var(--hk-yellow)' : 'var(--hk-border-strong)'}`,
            borderRadius: 8,
            background: value === opt ? 'var(--hk-yellow)' : 'var(--hk-input-bg)',
            color: value === opt ? 'var(--hk-black)' : 'var(--hk-muted)',
            cursor: 'pointer', textAlign: 'center', fontWeight: value === opt ? 700 : 500
          }}
        >{opt}</button>
      ))}
    </div>
  )
}

export function SaveButton({ onClick, label = 'Save', icon = 'device-floppy' }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: 12, background: 'var(--hk-yellow)', color: 'var(--hk-black)',
        border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
        marginTop: 8, letterSpacing: '0.02em', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8
      }}
    >
      <i className={`ti ti-${icon}`} aria-hidden="true" />
      {label}
    </button>
  )
}

export function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: 9, border: '0.5px dashed var(--hk-border-strong)',
        borderRadius: 8, background: 'none', color: 'var(--hk-muted)', fontSize: 13,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
      }}
    >
      <i className="ti ti-plus" aria-hidden="true" />
      {label}
    </button>
  )
}

export function TimeSelect({ value, onChange, style = {} }) {
  const { TIME_OPTIONS } = require('../utils/dates.js')
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ fontSize: 13, padding: '7px 8px', ...style }}>
      {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function InlineGrid({ cols = 2, gap = 8, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap }}>
      {children}
    </div>
  )
}

export function CardBlock({ children, style = {} }) {
  return (
    <div style={{
      border: '0.5px solid var(--hk-border)', borderRadius: 8,
      padding: 10, marginBottom: 8, background: 'var(--hk-surface)', ...style
    }}>
      {children}
    </div>
  )
}

export function GratitudeInput({ number, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{
        width: 24, height: 24, minWidth: 24, borderRadius: '50%',
        background: 'var(--hk-yellow)', color: 'var(--hk-black)',
        fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>{number}</div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="I am grateful for..."
        style={{ flex: 1 }}
      />
    </div>
  )
}

export function PainBar({ pct, onChange, id }) {
  const { painColor } = require('../utils/dates.js')
  const color = painColor(pct)
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--hk-muted)', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
        <span>Pain in the arse level</span>
        <span style={{ fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', marginBottom: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: color, transition: 'width 0.3s' }} />
      </div>
      <input type="range" min="0" max="100" step="5" value={pct} onChange={e => onChange(parseInt(e.target.value))} />
    </div>
  )
}

export function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--hk-yellow)', color: 'var(--hk-black)',
      padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700,
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s',
      pointerEvents: 'none', zIndex: 99, whiteSpace: 'nowrap'
    }}>
      {message}
    </div>
  )
}
