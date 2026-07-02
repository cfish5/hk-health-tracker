import React, { useState } from 'react'
import { Section, FormRow, RatingRow, SaveButton, AddButton, GratitudeInput, CardBlock, InlineGrid } from '../components/UI.jsx'
import { TIME_OPTIONS, DAY_DESCS } from '../utils/dates.js'
import { addToMealLib, getMealLib, addToSuppLib, getSuppLib } from '../utils/storage.js'
import { set, KEYS } from '../utils/storage.js'

const FEELINGS = ['Increased energy', 'Sleepy', 'Sweet cravings', 'No different']

function MealBlock({ num, data, onChange }) {
  const [open, setOpen] = useState(num === 1)
  const mealLib = getMealLib()
  return (
    <div style={{ border: '0.5px solid var(--hk-border)', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: '8px 10px', fontSize: 12, fontWeight: 600, color: 'var(--hk-yellow)', background: 'var(--hk-surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
      >
        Meal {num}
        <i className="ti ti-chevron-down" aria-hidden="true" style={{ fontSize: 13, transform: open ? 'rotate(180deg)' : 'none' }} />
      </div>
      {open && (
        <div style={{ padding: 10, background: 'var(--hk-card)' }}>
          <InlineGrid cols={2} gap={8}>
            <FormRow label="Time">
              <select value={data.time} onChange={e => onChange({ ...data, time: e.target.value })} style={{ fontSize: 13, padding: '7px 8px' }}>
                {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </FormRow>
            <FormRow label="Qty">
              <input type="text" value={data.qty} onChange={e => onChange({ ...data, qty: e.target.value })} placeholder="e.g. 200g" />
            </FormRow>
          </InlineGrid>
          {mealLib.length > 0 && (
            <FormRow label="Recent meals">
              <select
                onChange={e => { if (e.target.value) onChange({ ...data, item: e.target.value }) }}
                style={{ fontSize: 13, padding: '7px 8px' }}
                defaultValue=""
              >
                <option value="">Custom...</option>
                {mealLib.map((m, i) => <option key={i} value={m}>{m.length > 42 ? m.slice(0, 42) + '...' : m}</option>)}
              </select>
            </FormRow>
          )}
          <FormRow label="Food item(s)">
            <input
              type="text"
              value={data.item}
              onChange={e => onChange({ ...data, item: e.target.value })}
              onBlur={e => { if (e.target.value.trim()) addToMealLib(e.target.value.trim()) }}
              placeholder="Describe the meal..."
            />
          </FormRow>
          <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>After this meal I felt:</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {FEELINGS.map(f => {
              const sel = data.feelings?.includes(f)
              return (
                <button
                  key={f}
                  onClick={() => {
                    const feelings = data.feelings || []
                    onChange({ ...data, feelings: sel ? feelings.filter(x => x !== f) : [...feelings, f] })
                  }}
                  style={{
                    fontSize: 11, padding: '4px 8px',
                    border: `0.5px solid ${sel ? 'var(--hk-yellow)' : 'var(--hk-border-strong)'}`,
                    borderRadius: 20, background: sel ? 'var(--hk-yellow)' : 'var(--hk-input-bg)',
                    color: sel ? 'var(--hk-black)' : 'var(--hk-muted)',
                    cursor: 'pointer', fontWeight: sel ? 700 : 400
                  }}
                >{f}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function SuppBlock({ supp, onRemove, onChange }) {
  const suppLib = getSuppLib()
  return (
    <CardBlock>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--hk-yellow)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supplement</span>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--hk-muted)', cursor: 'pointer', fontSize: 18 }}><i className="ti ti-x" aria-hidden="true" /></button>
      </div>
      {suppLib.length > 0 && (
        <FormRow label="Previous">
          <select onChange={e => { if (e.target.value) onChange({ ...supp, name: e.target.value }) }} style={{ fontSize: 13, padding: '7px 8px' }} defaultValue="">
            <option value="">— pick or type below —</option>
            {suppLib.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        </FormRow>
      )}
      <input type="text" value={supp.name} onChange={e => onChange({ ...supp, name: e.target.value })} onBlur={e => { if (e.target.value.trim()) addToSuppLib(e.target.value.trim()) }} placeholder="Supplement name" style={{ marginBottom: 6 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
        {['t1', 't2', 't3'].map((t, i) => (
          <div key={t}>
            <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time {i + 1}</div>
            <select value={supp[t] || ''} onChange={e => onChange({ ...supp, [t]: e.target.value })} style={{ fontSize: 11, padding: '5px 4px' }}>
              {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>
    </CardBlock>
  )
}

export default function DietPage({ dateKey, onSave }) {
  const initialMeals = Array.from({ length: 6 }, () => ({ time: '', qty: '', item: '', feelings: [] }))
  const [meals, setMeals] = useState(initialMeals)
  const [gratitude, setGratitude] = useState(['', '', ''])
  const [dayRating, setDayRating] = useState(5)
  const [supps, setSupps] = useState([])
  const [water, setWater] = useState('')
  const [notes, setNotes] = useState('')

  function handleSave() {
    set(KEYS.DIET + dateKey, {
      date: dateKey, dayRating, gratitude, meals, supps, water, notes, saved: Date.now()
    })
    onSave('Diet log saved ✓')
  }

  return (
    <div style={{ padding: 12 }}>
      <Section icon="heart" title="Gratitude" defaultOpen={true}>
        <div style={{ fontSize: 12, color: 'var(--hk-muted)', marginBottom: 10 }}>Three things I am grateful for today</div>
        {gratitude.map((g, i) => (
          <GratitudeInput
            key={i} number={i + 1} value={g}
            onChange={v => { const n = [...gratitude]; n[i] = v; setGratitude(n) }}
          />
        ))}
      </Section>

      <Section icon="star" title="How is today?" defaultOpen={true}>
        <div style={{ fontSize: 40, fontWeight: 700, textAlign: 'center', color: 'var(--hk-yellow)', marginBottom: 4 }}>{dayRating}</div>
        <div style={{ fontSize: 12, textAlign: 'center', color: 'var(--hk-muted)', minHeight: 32, marginBottom: 12, lineHeight: 1.4 }}>{DAY_DESCS[dayRating]}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--hk-muted)' }}>1</span>
          <input type="range" min="1" max="10" step="1" value={dayRating} onChange={e => setDayRating(parseInt(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--hk-muted)' }}>10</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--hk-muted)' }}>Didn't want to face the world</span>
          <span style={{ fontSize: 10, color: 'var(--hk-muted)' }}>Absolutely crushing it</span>
        </div>
      </Section>

      <Section icon="bowl" title="Meals" defaultOpen={false}>
        {meals.map((meal, i) => (
          <MealBlock key={i} num={i + 1} data={meal} onChange={v => { const n = [...meals]; n[i] = v; setMeals(n) }} />
        ))}
      </Section>

      <Section icon="pill" title="Supplements" defaultOpen={false}>
        {supps.map((s, i) => (
          <SuppBlock
            key={i} supp={s}
            onRemove={() => setSupps(supps.filter((_, j) => j !== i))}
            onChange={v => { const n = [...supps]; n[i] = v; setSupps(n) }}
          />
        ))}
        <AddButton onClick={() => setSupps([...supps, { name: '', t1: '', t2: '', t3: '' }])} label="Add supplement" />
      </Section>

      <Section icon="droplet" title="Water & notes" defaultOpen={false}>
        <FormRow label="Water consumption (litres)">
          <input type="number" value={water} onChange={e => setWater(e.target.value)} step="0.1" min="0" max="10" placeholder="e.g. 2.5" />
        </FormRow>
        <FormRow label="Additional notes">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any observations..." />
        </FormRow>
      </Section>

      <SaveButton onClick={handleSave} label="Save diet log" />
    </div>
  )
}
