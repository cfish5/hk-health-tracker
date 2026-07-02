import React, { useState, useEffect, useRef } from 'react'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { getAllByPrefix, getAilments, getAilHistory } from '../utils/storage.js'
import { dateKey, daysAgo, ratingToNum } from '../utils/dates.js'
import { DAY_DESCS } from '../utils/dates.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const Y = '#f8e71c', T = '#1D9E75', C = '#e24b4a', P = '#9b59b6', A = '#e67e22', B = '#3498db'

const CHART_OPTIONS = {
  responsive: true, maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: { legend: { display: false, labels: { color: 'rgba(240,236,228,0.5)', boxWidth: 10, font: { size: 10 } } } },
  scales: {
    x: { grid: { color: 'rgba(248,231,28,0.06)' }, ticks: { color: 'rgba(240,236,228,0.4)', font: { size: 9 }, maxTicksLimit: 7, maxRotation: 0 } },
    y: { grid: { color: 'rgba(248,231,28,0.06)' }, ticks: { color: 'rgba(240,236,228,0.4)', font: { size: 9 } } }
  }
}

function ChartBox({ title, height = 150, children }) {
  return (
    <div style={{ background: 'var(--hk-card)', border: '0.5px solid var(--hk-border)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--hk-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ height, position: 'relative' }}>{children}</div>
    </div>
  )
}

function LineChartComp({ id, labels, datasets, yOpts = {} }) {
  const ref = useRef(null)
  const inst = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    if (inst.current) inst.current.destroy()
    inst.current = new Chart(ref.current, {
      type: 'line',
      data: { labels, datasets },
      options: { ...CHART_OPTIONS, plugins: { ...CHART_OPTIONS.plugins, legend: { ...CHART_OPTIONS.plugins.legend, display: datasets.length > 1 } }, scales: { ...CHART_OPTIONS.scales, y: { ...CHART_OPTIONS.scales.y, ...yOpts } } }
    })
    return () => inst.current?.destroy()
  }, [labels, datasets])
  return <canvas ref={ref} />
}

function BarChartComp({ id, labels, datasets, yOpts = {} }) {
  const ref = useRef(null)
  const inst = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    if (inst.current) inst.current.destroy()
    inst.current = new Chart(ref.current, {
      type: 'bar',
      data: { labels, datasets },
      options: { ...CHART_OPTIONS, scales: { ...CHART_OPTIONS.scales, y: { ...CHART_OPTIONS.scales.y, ...yOpts } } }
    })
    return () => inst.current?.destroy()
  }, [labels, datasets])
  return <canvas ref={ref} />
}

function StatGrid({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8, marginBottom: 12 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: 'var(--hk-surface)', border: '0.5px solid var(--hk-border)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--hk-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--hk-yellow)' }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

function getSeedData() {
  const today = new Date()
  const measData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - i * 7)
    return { date: dateKey(d), weight: +(76 + Math.sin(i) * 2).toFixed(1), stomach: +(89 - i * 0.4).toFixed(1), waist: +(83 - i * 0.25).toFixed(1), hips: +(96 - i * 0.2).toFixed(1) }
  }).reverse()
  const exData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - i * 2)
    return { date: dateKey(d), sleep: +(6 + Math.random() * 3).toFixed(1), mood: ['Good', 'Excellent', 'Good', 'Fair'][i % 4], energy: ['Good', 'Excellent', 'Fair', 'Good'][i % 4], intensity: 60 + Math.round(Math.random() * 30), saved: true }
  }).reverse()
  const dietData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - i * 2)
    return { date: dateKey(d), water: +(1.5 + Math.random() * 2).toFixed(1), dayRating: Math.round(5 + Math.random() * 4) }
  }).reverse()
  return { measData, exData, dietData }
}

function shortDate(d) { return d ? d.slice(5).replace('-', '/') : '' }

function BodyTab() {
  let meas = getAllByPrefix('meas_')
  let { measData } = getSeedData()
  if (meas.length === 0) meas = measData
  const lm = meas[meas.length - 1] || {}
  return (
    <>
      <StatGrid stats={[
        { label: 'Weight', value: lm.weight ? `${parseFloat(lm.weight).toFixed(1)} kg` : '—' },
        { label: 'Waist', value: lm.waist ? `${parseFloat(lm.waist).toFixed(1)} cm` : '—' },
        { label: 'Stomach', value: lm.stomach ? `${parseFloat(lm.stomach).toFixed(1)} cm` : '—' },
        { label: 'Hips', value: lm.hips ? `${parseFloat(lm.hips).toFixed(1)} cm` : '—' },
      ]} />
      <ChartBox title="Weight over time">
        <LineChartComp labels={meas.map(m => shortDate(m.date))} datasets={[{ label: 'Weight (kg)', data: meas.map(m => parseFloat(m.weight || 0)), borderColor: Y, backgroundColor: Y + '22', tension: 0.4, pointRadius: 4, fill: true }]} />
      </ChartBox>
      <ChartBox title="Measurements (cm)">
        <LineChartComp labels={meas.map(m => shortDate(m.date))} datasets={[
          { label: 'Stomach', data: meas.map(m => parseFloat(m.stomach || 0)), borderColor: C, tension: 0.4, pointRadius: 3 },
          { label: 'Waist', data: meas.map(m => parseFloat(m.waist || 0)), borderColor: T, tension: 0.4, pointRadius: 3 },
          { label: 'Hips', data: meas.map(m => parseFloat(m.hips || 0)), borderColor: P, tension: 0.4, pointRadius: 3 },
        ]} />
      </ChartBox>
    </>
  )
}

function WellnessTab() {
  let exer = getAllByPrefix('exercise_')
  let diet = getAllByPrefix('diet_')
  const { exData, dietData } = getSeedData()
  if (exer.length === 0) exer = exData
  if (diet.length === 0) diet = dietData
  const le = exer[exer.length - 1] || {}
  const ld = diet[diet.length - 1] || {}
  return (
    <>
      <StatGrid stats={[
        { label: 'Last sleep', value: le.sleep ? `${parseFloat(le.sleep).toFixed(1)} hrs` : '—' },
        { label: 'Day rating', value: ld.dayRating ? `${ld.dayRating}/10` : '—' },
      ]} />
      <ChartBox title="Daily rating (1–10)">
        <LineChartComp labels={diet.map(d => shortDate(d.date))} datasets={[{ label: 'Day rating', data: diet.map(d => parseInt(d.dayRating || 0)), borderColor: Y, backgroundColor: Y + '22', tension: 0.4, pointRadius: 4, fill: true }]} yOpts={{ min: 1, max: 10, ticks: { stepSize: 1 } }} />
      </ChartBox>
      <ChartBox title="Sleep hours">
        <BarChartComp labels={exer.map(e => shortDate(e.date))} datasets={[{ label: 'Hours', data: exer.map(e => parseFloat(e.sleep || 0)), backgroundColor: T + '88', borderColor: T, borderWidth: 1, borderRadius: 4 }]} yOpts={{ min: 0, max: 12 }} />
      </ChartBox>
      <ChartBox title="Mood & energy">
        <LineChartComp labels={exer.map(e => shortDate(e.date))} datasets={[
          { label: 'Mood', data: exer.map(e => ratingToNum(e.mood)), borderColor: P, tension: 0.4, pointRadius: 3 },
          { label: 'Energy', data: exer.map(e => ratingToNum(e.energy)), borderColor: A, tension: 0.4, pointRadius: 3 },
        ]} yOpts={{ min: 0, max: 4, ticks: { stepSize: 1, callback: v => ['', 'Poor', 'Fair', 'Good', 'Excellent'][v] || '' } }} />
      </ChartBox>
      <ChartBox title="Water intake (litres)" height={110}>
        <BarChartComp labels={diet.map(d => shortDate(d.date))} datasets={[{ label: 'Litres', data: diet.map(d => parseFloat(d.water || 0)), backgroundColor: B + '88', borderColor: B, borderWidth: 1, borderRadius: 4 }]} yOpts={{ min: 0 }} />
      </ChartBox>
    </>
  )
}

function ExerciseTab() {
  let exer = getAllByPrefix('exercise_')
  const { exData } = getSeedData()
  if (exer.length === 0) exer = exData
  const le = exer[exer.length - 1] || {}
  return (
    <>
      <StatGrid stats={[
        { label: 'Last intensity', value: `${le.intensity || 0}%` },
        { label: 'Workout type', value: le.workoutType || '—' },
      ]} />
      <ChartBox title="Workout intensity (%)">
        <LineChartComp labels={exer.map(e => shortDate(e.date))} datasets={[{ label: 'Intensity %', data: exer.map(e => parseInt(e.intensity || 0)), borderColor: C, backgroundColor: C + '22', tension: 0.4, fill: true, pointRadius: 3 }]} yOpts={{ min: 0, max: 100 }} />
      </ChartBox>
    </>
  )
}

function AilmentsTab() {
  const ails = getAilments()
  const cols = [C, A, P, T, B, Y]
  if (ails.length === 0) return <div style={{ fontSize: 13, color: 'var(--hk-muted)', padding: '20px 0', textAlign: 'center' }}>No ailments recorded yet.<br />Add them in the Body tab.</div>
  return ails.filter(a => a.name).map((a, i) => {
    const hist = getAilHistory(i)
    if (hist.length === 0) hist.push({ date: dateKey(), pct: a.pct || 0 })
    return (
      <ChartBox key={i} title={`${a.name} — pain level (%)`}>
        <LineChartComp labels={hist.map(h => shortDate(h.date))} datasets={[{ label: a.name, data: hist.map(h => h.pct), borderColor: cols[i % cols.length], backgroundColor: cols[i % cols.length] + '22', tension: 0.4, pointRadius: 4, fill: true }]} yOpts={{ min: 0, max: 100, ticks: { callback: v => v + '%' } }} />
      </ChartBox>
    )
  })
}

function SharePanel() {
  const [open, setOpen] = useState(false)
  const [incDiet, setIncDiet] = useState(true)
  const [incEx, setIncEx] = useState(true)
  const [incMeas, setIncMeas] = useState(true)
  const [incAil, setIncAil] = useState(true)
  const [incGrat, setIncGrat] = useState(false)
  const [from, setFrom] = useState(daysAgo(30))
  const [to, setTo] = useState(dateKey())
  const [msg, setMsg] = useState('')

  function send() {
    let body = `Health Progress Report\nPeriod: ${from} to ${to}\nGenerated: ${new Date().toLocaleDateString('en-AU')}\n\n`
    if (msg) body += `Note from client: ${msg}\n\n`
    if (incDiet) { const d = getAllByPrefix('diet_').filter(x => x.date >= from && x.date <= to); body += `=== DIET LOGS (${d.length} days) ===\n`; d.forEach(x => { body += `\n${x.date}\n  Day rating: ${x.dayRating}/10\n`; if (x.water) body += `  Water: ${x.water}L\n`; if (x.notes) body += `  Notes: ${x.notes}\n` }); body += '\n' }
    if (incEx) { const e = getAllByPrefix('exercise_').filter(x => x.date >= from && x.date <= to); body += `=== EXERCISE LOGS (${e.length} sessions) ===\n`; e.forEach(x => { body += `\n${x.date} — ${x.workoutType || ''} ${x.intensity ? x.intensity + '%' : ''}\n`; if (x.exercises) x.exercises.forEach(ex => { const ss = (ex.sets || []).filter(s => s.kg || s.reps).map((s, i) => `Set${i + 1}: ${s.kg || '?'}kg×${s.reps || '?'}${s.goal ? ` (goal:${s.goal})` : ''}`).join(', '); body += `  ${ex.name}: ${ss}\n` }); if (x.sleep) body += `  Sleep: ${x.sleep}hrs | Mood: ${x.mood} | Energy: ${x.energy}\n` }); body += '\n' }
    if (incMeas) { const m = getAllByPrefix('meas_').filter(x => x.date >= from && x.date <= to); body += `=== MEASUREMENTS (${m.length} entries) ===\n`; m.forEach(x => { body += `\n${x.date}\n  Weight: ${x.weight || '—'}kg | Waist: ${x.waist || '—'}cm | Stomach: ${x.stomach || '—'}cm | Hips: ${x.hips || '—'}cm\n` }); body += '\n' }
    if (incAil) { const ails = getAilments(); body += `=== AILMENTS (${ails.filter(a => a.name).length} active) ===\n`; ails.filter(a => a.name).forEach(a => { body += `\n${a.name}: ${a.pct || 0}% pain\n`; if (a.desc) body += `  ${a.desc}\n` }); body += '\n' }
    if (incGrat) { const d = getAllByPrefix('diet_').filter(x => x.date >= from && x.date <= to); body += `=== GRATITUDE JOURNAL ===\n`; d.forEach(x => { if (x.gratitude?.some(g => g)) { body += `\n${x.date}\n`; x.gratitude.forEach((g, i) => { if (g) body += `  ${i + 1}. ${g}\n` }) } }) }
    const subject = `Health Progress Report — ${from} to ${to}`
    window.location.href = `mailto:admin@holisticcoach.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const checks = [
    ['Diet logs', 'Meals, water, supplements, day rating', incDiet, setIncDiet],
    ['Exercise logs', 'Workouts, sets, reps, aerobic', incEx, setIncEx],
    ['Body measurements', 'Weight, waist, stomach, hips', incMeas, setIncMeas],
    ['Ailments', 'Active issues and pain levels', incAil, setIncAil],
    ['Gratitude journal', 'Daily gratitude entries', incGrat, setIncGrat],
  ]

  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: 12, background: 'rgba(248,231,28,0.08)', color: 'var(--hk-yellow)', border: '1px solid var(--hk-border-strong)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <i className="ti ti-send" aria-hidden="true" /> Share progress with Hector
      </button>
      {open && (
        <div style={{ background: 'var(--hk-card)', border: '0.5px solid var(--hk-border)', borderRadius: 10, padding: 14, marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--hk-yellow)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Choose what to share</div>
          <div style={{ fontSize: 12, color: 'var(--hk-muted)', marginBottom: 12 }}>Hector will receive a formatted HTML report at admin@holisticcoach.com.au</div>
          {checks.map(([label, desc, val, setter]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid var(--hk-border)', fontSize: 13, cursor: 'pointer', color: 'var(--hk-text)' }} onClick={() => setter(!val)}>
              <input type="checkbox" checked={val} onChange={() => setter(!val)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--hk-yellow)' }} />
              <label style={{ cursor: 'pointer', flex: 1 }}>
                {label}
                <span style={{ fontSize: 11, color: 'var(--hk-muted)', display: 'block' }}>{desc}</span>
              </label>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date range</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
              <div><div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 3 }}>From</div><input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 3 }}>To</div><input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--hk-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message to Hector</div>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Add a note for Hector..." style={{ minHeight: 48 }} />
          </div>
          <button onClick={send} style={{ width: '100%', padding: 12, background: 'var(--hk-yellow)', color: 'var(--hk-black)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <i className="ti ti-mail" aria-hidden="true" /> Open email to Hector
          </button>
        </div>
      )}
    </div>
  )
}

const GRAPH_TABS = ['Body', 'Wellness', 'Exercise', 'Ailments']

export default function ProgressPage() {
  const [tab, setTab] = useState('Body')
  return (
    <div style={{ padding: 12 }}>
      <SharePanel />
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
        {GRAPH_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, minWidth: 60, padding: '8px 4px', fontSize: 11, border: `0.5px solid ${tab === t ? 'var(--hk-yellow)' : 'var(--hk-border-strong)'}`, borderRadius: 8, background: tab === t ? 'var(--hk-yellow)' : 'var(--hk-input-bg)', color: tab === t ? 'var(--hk-black)' : 'var(--hk-muted)', cursor: 'pointer', fontWeight: tab === t ? 700 : 500, textAlign: 'center' }}>{t}</button>
        ))}
      </div>
      {tab === 'Body' && <BodyTab />}
      {tab === 'Wellness' && <WellnessTab />}
      {tab === 'Exercise' && <ExerciseTab />}
      {tab === 'Ailments' && <AilmentsTab />}
    </div>
  )
}
