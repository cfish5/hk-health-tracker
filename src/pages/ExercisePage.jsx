import React, { useState, useRef } from 'react'
import { Section, FormRow, RatingRow, SaveButton, AddButton, CardBlock, InlineGrid } from '../components/UI.jsx'
import { TIME_OPTIONS } from '../utils/dates.js'
import { getExLib, saveExLibSets, addToExLib, getSuppLib } from '../utils/storage.js'
import { set, get, KEYS } from '../utils/storage.js'

function ExercisePicker({ onSelect, onNew, onClose }) {
  const lib = getExLib()
  return (
    <div style={{ background: 'rgba(30,28,39,0.97)', border: '1px solid var(--hk-border-strong)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--hk-yellow)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Exercise library
        <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', color: 'var(--hk-muted)', cursor: 'pointer', fontSize: 18 }}><i className="ti ti-x" aria-hidden="true" /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 190, overflowY: 'auto' }}>
        {lib.map((e, i) => (
          <div
            key={i} onClick={() => onSelect(e)}
            style={{ background: 'var(--hk-input-bg)', border: '0.5px solid var(--hk-border)', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}
          >
            <span>{e.name}</span>
            <span style={{ fontSize: 11, color: 'var(--hk-muted)' }}>{e.lastUsed || ''}</span>
          </div>
        ))}
      </div>
      <button onClick={onNew} style={{ background: 'none', border: '0.5px dashed var(--hk-border-strong)', borderRadius: 8, padding: '9px 12px', color: 'var(--hk-yellow)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, width: '100%' }}>
        <i className="ti ti-plus" aria-hidden="true" /> New exercise
      </button>
    </div>
  )
}

function ExerciseBlock({ ex, dateKey, onChange, onRemove }) {
  function updateSet(setIdx, field, value) {
    const newSets = ex.sets.map((s, i) => i === setIdx ? { ...s, [field]: value } : s)
    onChange({ ...ex, sets: newSets })
  }

  function autoFill(setIdx, field) {
    if (setIdx === 0) return
    const prev = ex.sets[setIdx - 1]
    if (prev && prev[field] && !ex.sets[setIdx][field]) {
      updateSet(setIdx, field, prev[field])
    }
  }

  function propagate(setIdx, field, value) {
    const nextIdx = setIdx + 1
    if (nextIdx < ex.sets.length && !ex.sets[nextIdx][field]) {
      updateSet(nextIdx, field, value)
    }
  }

  return (
    <div style={{ border: '0.5px solid var(--hk-border)', borderRadius: 8, padding: 10, marginBottom: 10, background: 'var(--hk-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <input
          type="text" value={ex.name}
          onChange={e => onChange({ ...ex, name: e.target.value })}
          onBlur={e => { if (e.target.value.trim()) addToExLib(e.target.value.trim(), dateKey) }}
          placeholder="Exercise name"
          style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: '6px 8px', background: 'var(--hk-input-bg)', borderRadius: 8, border: '0.5px solid var(--hk-border-strong)', color: 'var(--hk-text)', marginRight: 8 }}
        />
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--hk-muted)', cursor: 'pointer', fontSize: 18 }}><i className="ti ti-x" aria-hidden="true" /></button>
      </div>
      {ex.prefilled && <div style={{ fontSize: 11, color: 'var(--hk-yellow)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><i className="ti ti-history" style={{ fontSize: 13 }} aria-hidden="true" /> Pre-filled from last session</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.75fr 0.75fr 0.85fr', gap: 4, marginBottom: 4 }}>
        {['Set', 'Weight', 'Reps', 'Goal'].map((h, i) => (
          <span key={h} style={{ fontSize: 10, color: i === 3 ? 'var(--hk-yellow)' : 'var(--hk-muted)', textAlign: i === 0 ? 'left' : 'center', textTransform: 'uppercase', letterSpacing: '0.04em', paddingLeft: i === 0 ? 2 : 0 }}>{h}</span>
        ))}
      </div>
      {ex.sets.map((s, si) => (
        <div key={si} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.75fr 0.75fr 0.85fr', gap: 4, marginBottom: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--hk-muted)', paddingLeft: 2 }}>Set {si + 1}</span>
          {['kg', 'reps'].map(field => {
            const isPrefilled = !!s[field] && ex.prefilled
            return (
              <input
                key={field} type="number" placeholder={field === 'kg' ? 'kg' : 'reps'}
                value={s[field] || ''}
                onFocus={() => autoFill(si, field)}
                onChange={e => { updateSet(si, field, e.target.value); propagate(si, field, e.target.value) }}
                style={{
                  fontSize: 12, padding: '5px 3px', borderRadius: 6, textAlign: 'center', width: '100%',
                  background: isPrefilled ? 'rgba(248,231,28,0.1)' : 'var(--hk-input-bg)',
                  border: `0.5px solid ${isPrefilled ? 'var(--hk-yellow)' : 'var(--hk-border-strong)'}`,
                  color: isPrefilled ? 'var(--hk-yellow)' : 'var(--hk-text)'
                }}
              />
            )
          })}
          <input
            type="number" placeholder="—" value={s.goal || ''}
            onChange={e => updateSet(si, 'goal', e.target.value)}
            title="Goal weight or reps (optional)"
            style={{ fontSize: 12, padding: '5px 3px', borderRadius: 6, textAlign: 'center', width: '100%', background: 'rgba(248,231,28,0.08)', border: '0.5px solid var(--hk-yellow)', color: 'var(--hk-yellow)' }}
          />
        </div>
      ))}
      <div style={{ fontSize: 11, color: 'var(--hk-yellow)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4, opacity: 0.7 }}>
        <i className="ti ti-target" style={{ fontSize: 13 }} aria-hidden="true" /> Goal column optional
      </div>
    </div>
  )
}

function AerobicBlock({ act, onChange, onRemove }) {
  return (
    <div style={{ border: '0.5px solid var(--hk-border)', borderRadius: 8, padding: 10, marginBottom: 8, background: 'var(--hk-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <input type="text" value={act.name} onChange={e => onChange({ ...act, name: e.target.value })} placeholder="Activity (e.g. Run, Bike, Walk)" style={{ flex: 1, fontSize: 14, fontWeight: 600, padding: '6px 8px', background: 'var(--hk-input-bg)', borderRadius: 8, border: '0.5px solid var(--hk-border-strong)', color: 'var(--hk-text)', marginRight: 8 }} />
        <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--hk-muted)', cursor: 'pointer', fontSize: 18 }}><i className="ti ti-x" aria-hidden="true" /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time</div>
          <select value={act.time || ''} onChange={e => onChange({ ...act, time: e.target.value })} style={{ fontSize: 11, padding: '5px 4px' }}>
            {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duration</div>
          <input type="text" value={act.duration || ''} onChange={e => onChange({ ...act, duration: e.target.value })} placeholder="45min" style={{ fontSize: 12, padding: 6 }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dist/Resist</div>
          <input type="text" value={act.dist || ''} onChange={e => onChange({ ...act, dist: e.target.value })} placeholder="5km" style={{ fontSize: 12, padding: 6 }} />
        </div>
      </div>
    </div>
  )
}

function newSet() { return { kg: '', reps: '', goal: '' } }
function emptyExercise(name = '', prefilled = false, lastSets = []) {
  const sets = Array.from({ length: 6 }, (_, i) => lastSets[i] ? { ...lastSets[i] } : newSet())
  return { name, sets, prefilled }
}

export default function ExercisePage({ dateKey, prevDateKey, onSave }) {
  const [showPicker, setShowPicker] = useState(false)
  const [exercises, setExercises] = useState([])
  const [aerobic, setAerobic] = useState([])
  const [wstart, setWstart] = useState('')
  const [wfinish, setWfinish] = useState('')
  const [bodyparts, setBodyparts] = useState('')
  const [wtype, setWtype] = useState('')
  const [intensity, setIntensity] = useState(70)
  const [mental, setMental] = useState('')
  const [sleep, setSleep] = useState('')
  const [mood, setMood] = useState('')
  const [appetite, setAppetite] = useState('')
  const [energy, setEnergy] = useState('')
  const [exNotes, setExNotes] = useState('')
  const [draftBanner, setDraftBanner] = useState(false)

  function copyYesterday() {
    const prev = get(KEYS.EXERCISE_FULL + prevDateKey)
    if (!prev) { onSave('No session found for yesterday'); return }
    if (prev.exercises) setExercises(prev.exercises.map(ex => emptyExercise(ex.name, true, ex.sets || [])))
    if (prev.aerobic) setAerobic(prev.aerobic.map(a => ({ ...a })))
    if (prev.bodyparts) setBodyparts(prev.bodyparts)
    setDraftBanner(true)
    onSave("Yesterday's session loaded")
  }

  function handleSelectEx(libEntry) {
    setExercises(prev => [...prev, emptyExercise(libEntry.name, !!(libEntry.lastSets?.length), libEntry.lastSets || [])])
    setShowPicker(false)
  }

  function handleNewEx() {
    const name = window.prompt('Exercise name:')
    if (name?.trim()) { setExercises(prev => [...prev, emptyExercise(name.trim())]); setShowPicker(false) }
  }

  function handleSave() {
    const exData = exercises.map(ex => {
      saveExLibSets(ex.name, ex.sets, dateKey)
      return { name: ex.name, sets: ex.sets }
    })
    const full = { date: dateKey, workoutType: wtype, intensity, mental, sleep, mood, appetite, energy, notes: exNotes, bodyparts, exercises: exData, aerobic, saved: Date.now() }
    set(KEYS.EXERCISE + dateKey, full)
    set(KEYS.EXERCISE_FULL + dateKey, full)
    setDraftBanner(false)
    onSave('Exercise log saved ✓')
  }

  return (
    <div style={{ padding: 12 }}>
      <button onClick={copyYesterday} style={{ width: '100%', padding: 10, background: 'rgba(248,231,28,0.1)', color: 'var(--hk-yellow)', border: '0.5px solid var(--hk-border-strong)', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <i className="ti ti-copy" aria-hidden="true" /> Copy yesterday's session as draft
      </button>
      {draftBanner && (
        <div style={{ background: 'rgba(248,231,28,0.08)', border: '0.5px solid var(--hk-border-strong)', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: 'var(--hk-yellow)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-check" aria-hidden="true" /> Yesterday loaded as draft — edit as needed then save
        </div>
      )}
      <Section icon="clock" title="Workout summary" defaultOpen={true}>
        <InlineGrid cols={2} gap={8}>
          <FormRow label="Start time">
            <select value={wstart} onChange={e => setWstart(e.target.value)} style={{ fontSize: 13, padding: '7px 8px' }}>
              {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormRow>
          <FormRow label="Finish time">
            <select value={wfinish} onChange={e => setWfinish(e.target.value)} style={{ fontSize: 13, padding: '7px 8px' }}>
              {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormRow>
        </InlineGrid>
        <FormRow label="Body parts exercised">
          <input type="text" value={bodyparts} onChange={e => setBodyparts(e.target.value)} placeholder="e.g. Chest, Shoulders, Triceps" />
        </FormRow>
        <FormRow label="Workout type">
          <RatingRow options={['Heavy', 'Medium', 'Light']} value={wtype} onChange={setWtype} />
        </FormRow>
        <FormRow label={`Intensity (${intensity}%)`}>
          <input type="range" min="0" max="100" step="5" value={intensity} onChange={e => setIntensity(parseInt(e.target.value))} />
        </FormRow>
        <FormRow label="Mental attitude">
          <RatingRow options={['Excellent', 'Good', 'Fair', 'Poor']} value={mental} onChange={setMental} />
        </FormRow>
      </Section>

      <Section icon="barbell" title="Weight training" defaultOpen={true}>
        {showPicker && <ExercisePicker onSelect={handleSelectEx} onNew={handleNewEx} onClose={() => setShowPicker(false)} />}
        {exercises.map((ex, i) => (
          <ExerciseBlock
            key={i} ex={ex} dateKey={dateKey}
            onChange={v => setExercises(prev => prev.map((e, j) => j === i ? v : e))}
            onRemove={() => setExercises(prev => prev.filter((_, j) => j !== i))}
          />
        ))}
        <AddButton onClick={() => { if (getExLib().length > 0) setShowPicker(true); else handleNewEx() }} label="Add exercise" />
      </Section>

      <Section icon="run" title="Aerobic activity" defaultOpen={false}>
        {aerobic.map((a, i) => (
          <AerobicBlock
            key={i} act={a}
            onChange={v => setAerobic(prev => prev.map((x, j) => j === i ? v : x))}
            onRemove={() => setAerobic(prev => prev.filter((_, j) => j !== i))}
          />
        ))}
        <AddButton onClick={() => setAerobic(prev => [...prev, { name: '', time: '', duration: '', dist: '' }])} label="Add activity" />
      </Section>

      <Section icon="mood-happy" title="Daily evaluation" defaultOpen={false}>
        <FormRow label="Hours slept">
          <input type="number" value={sleep} onChange={e => setSleep(e.target.value)} step="0.5" min="0" max="16" placeholder="e.g. 7.5" />
        </FormRow>
        <FormRow label="Mood"><RatingRow options={['Excellent', 'Good', 'Fair', 'Poor']} value={mood} onChange={setMood} /></FormRow>
        <FormRow label="Appetite"><RatingRow options={['Excellent', 'Good', 'Fair', 'Poor']} value={appetite} onChange={setAppetite} /></FormRow>
        <FormRow label="Energy"><RatingRow options={['Excellent', 'Good', 'Fair', 'Poor']} value={energy} onChange={setEnergy} /></FormRow>
        <FormRow label="Notes"><textarea value={exNotes} onChange={e => setExNotes(e.target.value)} placeholder="Any observations..." /></FormRow>
      </Section>

      <SaveButton onClick={handleSave} label="Save exercise log" />
    </div>
  )
}
