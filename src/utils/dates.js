export function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function prevDateKey(date = new Date()) {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return dateKey(d)
}

export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short'
  })
}

export function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return dateKey(d)
}

export function timeOptions() {
  const opts = [{ value: '', label: '— time —' }]
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const ap = h < 12 ? 'AM' : 'PM'
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      opts.push({ value: `${hh}:${mm}`, label: `${h12}:${mm} ${ap}` })
    }
  }
  return opts
}

export const TIME_OPTIONS = timeOptions()

export const DAY_DESCS = {
  1: "Rough — really didn't want to face the world",
  2: "Tough going, very low energy all day",
  3: "Below average — struggled to get moving",
  4: "Slightly off, not quite firing on all cylinders",
  5: "Average day — getting through it",
  6: "Decent day, a bit above average",
  7: "Good day — solid, productive and positive",
  8: "Great day — energy up, things clicking",
  9: "Excellent day — feeling strong and motivated",
  10: "Absolutely crushing it — an awesome day!"
}

export function ratingToNum(r) {
  return { Excellent: 4, Good: 3, Fair: 2, Poor: 1 }[r] || 0
}

export function painColor(pct) {
  if (pct >= 70) return '#e24b4a'
  if (pct >= 40) return '#f8e71c'
  return '#1D9E75'
}
