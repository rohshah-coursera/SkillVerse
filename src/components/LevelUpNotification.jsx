import { useEffect, useState } from 'react'
import './LevelUpNotification.css'

function LevelUpNotification({ domain, level, onComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete()
      }, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const domainColors = {
    'Data Science': '#0056d2',
    'IT': '#00a86b',
    'Cybersecurity': '#d32f2f',
    'Healthcare': '#f57c00',
    'Sales': '#7b1fa2'
  }

  const domainIcons = {
    'Data Science': '📊',
    'IT': '💻',
    'Cybersecurity': '🔒',
    'Healthcare': '🏥',
    'Sales': '💼'
  }

  return (
    <div className={`level-up-notification ${isVisible ? 'visible' : ''}`}>
      <div 
        className="level-up-content"
        style={{ borderColor: domainColors[domain] || '#0056d2' }}
      >
        <div className="level-up-icon">{domainIcons[domain] || '⭐'}</div>
        <div className="level-up-text">
          <div className="level-up-title">LEVEL UP!</div>
          <div className="level-up-domain">{domain}</div>
          <div className="level-up-level">Now at Level {level}</div>
        </div>
        <div className="level-up-sparkles">✨</div>
      </div>
    </div>
  )
}

export default LevelUpNotification

