// All data keys use prefixes so getAllByPrefix works cleanly
export const KEYS = {
  DIET: 'diet_',
  EXERCISE: 'exercise_',
  EXERCISE_FULL: 'exercise_full_',
  MEAS: 'meas_',
  AIL_MASTER: 'ailments_master',
  AIL_HIST: 'ail_hist_',
  EX_LIB: 'ex_library',
  SUPP_LIB: 'supp_library',
  MEAL_LIB: 'meal_library',
}

export function get(key, def = null) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : def
  } catch { return def }
}

export function set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function getAllByPrefix(prefix) {
  const items = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(prefix)) {
      try { items.push(JSON.parse(localStorage.getItem(k))) } catch {}
    }
  }
  return items.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
}

export function getAllByPrefixInRange(prefix, from, to) {
  return getAllByPrefix(prefix).filter(
    item => item.date && item.date >= from && item.date <= to
  )
}

// Exercise library
export function getExLib() { return get(KEYS.EX_LIB, []) }
export function saveExLib(lib) { set(KEYS.EX_LIB, lib) }
export function addToExLib(name, date) {
  if (!name.trim()) return
  const lib = getExLib()
  const idx = lib.findIndex(e => e.name.toLowerCase() === name.toLowerCase())
  if (idx >= 0) lib[idx].lastUsed = date
  else lib.push({ name: name.trim(), lastUsed: date })
  saveExLib(lib)
}
export function saveExLibSets(name, sets, date) {
  const lib = getExLib()
  const idx = lib.findIndex(e => e.name.toLowerCase() === name.toLowerCase())
  if (idx >= 0) { lib[idx].lastSets = sets; lib[idx].lastUsed = date }
  else lib.push({ name: name.trim(), lastSets: sets, lastUsed: date })
  saveExLib(lib)
}

// Supplement library
export function getSuppLib() { return get(KEYS.SUPP_LIB, []) }
export function saveSuppLib(lib) { set(KEYS.SUPP_LIB, lib) }
export function addToSuppLib(name) {
  if (!name.trim()) return
  const lib = getSuppLib()
  if (!lib.find(s => s.toLowerCase() === name.toLowerCase())) lib.push(name.trim())
  saveSuppLib(lib)
}

// Meal library
export function getMealLib() { return get(KEYS.MEAL_LIB, []) }
export function addToMealLib(item) {
  if (!item.trim()) return
  let lib = getMealLib()
  lib = lib.filter(m => m !== item.trim())
  lib.unshift(item.trim())
  if (lib.length > 8) lib = lib.slice(0, 8)
  set(KEYS.MEAL_LIB, lib)
}

// Ailments
export function getAilments() { return get(KEYS.AIL_MASTER, []) }
export function saveAilments(ails) { set(KEYS.AIL_MASTER, ails) }
export function recordAilHistory(idx, pct, date) {
  const key = KEYS.AIL_HIST + idx
  const hist = get(key, [])
  const existing = hist.findIndex(h => h.date === date)
  if (existing >= 0) hist[existing].pct = pct
  else hist.push({ date, pct })
  set(key, hist)
}
export function getAilHistory(idx) { return get(KEYS.AIL_HIST + idx, []) }
