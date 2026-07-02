import React from 'react'
import { formatDisplayDate } from '../utils/dates.js'

export default function TopBar({ currentDate, onDateChange }) {
  return (
    <div style={{ background: 'var(--hk-yellow)', position: 'sticky', top: 0, zIndex: 10, paddingTop: 'var(--safe-top)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 8px' }}>
        <img
          src="https://import.cdn.thinkific.com/802429%2Fcustom_site_themes%2Fid%2F63MGYbP2TG2fH6454Ouu_HK%20Holistic.png"
          alt="HK Holistic Coach"
          style={{ height: 32, objectFit: 'contain' }}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
        <span style={{ display: 'none', fontSize: 15, fontWeight: 700, color: 'var(--hk-black)' }}>
          HK Holistic Coach
        </span>
        <button
          onClick={onDateChange}
          style={{
            fontSize: 12, color: 'var(--hk-black)', background: 'rgba(0,0,0,0.12)',
            border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
          }}
        >
          <i className="ti ti-calendar" aria-hidden="true" />
          {formatDisplayDate(currentDate)}
        </button>
      </div>
      <div style={{
        background: 'var(--hk-black)', padding: '5px 14px',
        fontSize: 10, color: 'var(--hk-yellow)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600
      }}>
        Health &amp; Performance Tracker
      </div>
    </div>
  )
}
