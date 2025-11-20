import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Calendar } from 'lucide-react'
import { useGame } from '../context/GameContext'
import './StreakPopup.css'

const StreakPopup = ({ isOpen, onClose, streak }) => {
  // Generate last 30 days calendar
  const calendarData = useMemo(() => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Find the first day of the week (Sunday) for the first day in our 30-day range
    const firstDay = new Date(today)
    firstDay.setDate(today.getDate() - 29)
    const firstDayOfWeek = firstDay.getDay()
    
    // Add padding days at the start to align with weekdays
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, hasActivity: false, isPadding: true })
    }
    
    // Add the actual 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      // Check if this day has activity (simplified - you can enhance with actual data)
      const hasActivity = i < streak // Simple logic: last N days have activity
      
      days.push({
        date,
        hasActivity,
        dayOfWeek: date.getDay(),
        dayOfMonth: date.getDate(),
        isPadding: false,
      })
    }
    
    return days
  }, [streak])

  const shareToLinkedIn = () => {
    const text = `🔥 I've maintained a ${streak}-day learning streak! Keep pushing forward! 🚀`
    const url = encodeURIComponent(window.location.href)
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="streak-popup"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <div className="popup-title-section">
              <Calendar size={24} className="popup-icon" />
              <div>
                <h2 className="popup-title">Learning Streak</h2>
                <p className="popup-subtitle">{streak} days of continuous learning</p>
              </div>
            </div>
            <button className="popup-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="streak-content">
            <div className="streak-calendar-container">
              <div className="calendar-header">
                <div className="calendar-legend">
                  <div className="legend-item">
                    <div className="legend-square active"></div>
                    <span>Active day</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-square inactive"></div>
                    <span>No activity</span>
                  </div>
                </div>
              </div>
              
              <div className="calendar-grid">
                {calendarData.map((day, index) => (
                  <motion.div
                    key={index}
                    className={`calendar-day ${day.isPadding ? 'padding' : day.hasActivity ? 'active' : 'inactive'}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    title={day.date ? `${day.date.toLocaleDateString()} - ${day.hasActivity ? 'Active' : 'No activity'}` : ''}
                  >
                    {!day.isPadding && <div className="day-indicator"></div>}
                  </motion.div>
                ))}
              </div>

              <div className="calendar-weekdays">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>
            </div>

            <div className="streak-stats">
              <div className="streak-stat-card">
                <div className="stat-value">{streak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
              <div className="streak-stat-card">
                <div className="stat-value">🔥</div>
                <div className="stat-label">Keep it up!</div>
              </div>
            </div>

            <div className="share-section">
              <p className="share-text">Share your achievement on LinkedIn!</p>
              <button className="share-button" onClick={shareToLinkedIn}>
                <Share2 size={18} />
                <span>Share on LinkedIn</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StreakPopup

