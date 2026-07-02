import React, { useState } from 'react'
import { Section, FormRow, SaveButton, AddButton, PainBar, CardBlock } from '../components/UI.jsx'
import { getAilments, saveAilments, recordAilHistory } from '../utils/storage.js'
import { set, KEYS } from '../utils/storage.js'

const MEAS_FIELDS = [
  { id: 'weight', label: 'Weight', step: 0.1, units: ['kg', 'lbs'] },
  { id: 'stomach', label: 'Stomach', step: 0.5, units: ['cm', 'in'] },
  { id: 'waist', label: 'Waist', step: 0.5, units: ['cm', 'in'] },
  { id: 'hips', label: 'Hips / Buttocks', step: 0.5, units: ['cm', 'in'] },
  { id: 'thigh', label: 'Thigh (L)', step: 0.5, units: ['cm', 'in'] },
  { id: 'chest', label: 'Chest', step: 0.5, units: ['cm', 'in'] },
  { id: 'arm', label: 'Upper arm', step: 0.5, units: ['cm', 'in'] },
]

function MeasurementsTab({ dateKey, onSave }) {
  const initVals = Object.fromEntries(MEAS_FIELDS.map(f => [f.id, '']))
  const initUnits = { weight: 'kg', stomach: 'cm', waist: 'cm', hips: 'cm', thigh: 'cm', chest: 'cm', arm: 'cm' }
  const [vals, setVals] = useState(initVals)
  const [units, setUnits] = useState(initUnits)
  const [notes, setNotes] = useState('')

  function handleSave() {
    set(KEYS.MEAS + dateKey, { date: dateKey, ...vals, notes, saved: Date.now() })
    onSave('Measurements saved ✓')
  }

  return (
    <>
      <Section icon="ruler" title="Log measurements">
        {MEAS_FIELDS.map(f => (
          <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 13, color: 'var(--hk-text)' }}>{f.label}</label>
            <input
              type="number" step={f.step} placeholder="0.0"
              value={vals[f.id]}
              onChange={e => setVals({ ...vals, [f.id]: e.target.value })}
              style={{ fontSize: 13, padding: '7px 6px' }}
            />
            <select
              value={units[f.id]}
              onChange={e => setUnits({ ...units, [f.id]: e.target.value })}
              style={{ fontSize: 12, padding: '7px 4px' }}
            >
              {f.units.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        ))}
        <FormRow label="Notes" style={{ marginTop: 8 }}>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. morning, before breakfast..." />
        </FormRow>
      </Section>
      <SaveButton onClick={handleSave} label="Save measurements" />
    </>
  )
}

function AilmentCard({ ail, index, dateKey, onChange, onRemove }) {
  return (
    <div style={{ border: '0.5px solid var(--hk-border)', borderRadius: 8, padding: 12, marginBottom: 8, background: 'var(--hk-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <input
          type="text" value={ail.name || ''} placeholder="Body part / ailment name"
          onChange={e => onChange({ ...ail, name: e.target.value })}
          style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: '6px 8px', background: 'var(--hk-input-bg)', borderRadius: 8, border: '0.5px solid var(--hk-border-strong)', color: 'var(--hk-text)', marginRight: 8 }}
        />
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--hk-muted)', cursor: 'pointer', fontSize: 18 }}>
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      </div>
      <FormRow label="Description / problem">
        <textarea
          value={ail.desc || ''} placeholder="Describe the issue, when it started, triggers..."
          onChange={e => onChange({ ...ail, desc: e.target.value })}
          style={{ minHeight: 52 }}
        />
      </FormRow>
      <PainBar
        pct={ail.pct || 0}
        onChange={pct => {
          onChange({ ...ail, pct, lastUpdated: dateKey })
          recordAilHistory(index, pct, dateKey)
        }}
        id={`ail-${index}`}
      />
      <div style={{ fontSize: 10, color: 'var(--hk-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Last updated: {ail.lastUpdated || dateKey}
      </div>
    </div>
  )
}

function AilmentsTab({ dateKey, onSave }) {
  const [ails, setAils] = useState(getAilments())

  function updateAil(i, updated) {
    const next = ails.map((a, j) => j === i ? updated : a)
    setAils(next)
    saveAilments(next)
  }

  function removeAil(i) {
    if (!window.confirm('Remove this ailment?')) return
    const next = ails.filter((_, j) => j !== i)
    setAils(next)
    saveAilments(next)
  }

  function addAil() {
    const next = [...ails, { name: '', desc: '', pct: 0, created: dateKey, lastUpdated: dateKey }]
    setAils(next)
    saveAilments(next)
  }

  function handleSave() {
    saveAilments(ails)
    onSave('Ailments saved ✓')
  }

  return (
    <>
      <Section icon="alert-circle" title="Active ailments">
        {ails.map((a, i) => (
          <AilmentCard
            key={i} ail={a} index={i} dateKey={dateKey}
            onChange={v => updateAil(i, v)}
            onRemove={() => removeAil(i)}
          />
        ))}
        <AddButton onClick={addAil} label="Add ailment" />
      </Section>
      <SaveButton onClick={handleSave} label="Save ailments" />
    </>
  )
}

export default function BodyPage({ dateKey, onSave }) {
  const [tab, setTab] = useState('meas')

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[['meas', 'Measurements'], ['ail', 'Ailments']].map(([id, label]) => (
          <button
            key={id} onClick={() => setTab(id)}
            style={{
              flex: 1, padding: '8px 4px', fontSize: 12,
              border: `0.5px solid ${tab === id ? 'var(--hk-yellow)' : 'var(--hk-border-strong)'}`,
              borderRadius: 8,
              background: tab === id ? 'var(--hk-yellow)' : 'var(--hk-input-bg)',
              color: tab === id ? 'var(--hk-black)' : 'var(--hk-muted)',
              cursor: 'pointer', fontWeight: tab === id ? 700 : 500
            }}
          >{label}</button>
        ))}
      </div>
      {tab === 'meas' ? <MeasurementsTab dateKey={dateKey} onSave={onSave} /> : <AilmentsTab dateKey={dateKey} onSave={onSave} />}
    </div>
  )
}
