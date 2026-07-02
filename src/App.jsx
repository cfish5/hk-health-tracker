import React, { useState, useCallback } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import { Toast } from './components/UI.jsx'
import DietPage from './pages/DietPage.jsx'
import ExercisePage from './pages/ExercisePage.jsx'
import BodyPage from './pages/BodyPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import { dateKey, prevDateKey } from './utils/dates.js'

export default function App() {
  const [page, setPage] = useState('diet')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [toast, setToast] = useState({ message: '', visible: false })

  const showToast = useCallback((message) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400)
  }, [])

  function handleDateChange() {
    const v = window.prompt('Enter date (YYYY-MM-DD):', dateKey(currentDate))
    if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
      setCurrentDate(new Date(v + 'T12:00:00'))
    }
  }

  const dk = dateKey(currentDate)
  const pdk = prevDateKey(currentDate)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--hk-black)' }}>
      <TopBar currentDate={currentDate} onDateChange={handleDateChange} />
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {page === 'diet' && <DietPage dateKey={dk} onSave={showToast} />}
        {page === 'exercise' && <ExercisePage dateKey={dk} prevDateKey={pdk} onSave={showToast} />}
        {page === 'body' && <BodyPage dateKey={dk} onSave={showToast} />}
        {page === 'progress' && <ProgressPage />}
      </div>
      <BottomNav active={page} onChange={setPage} />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
