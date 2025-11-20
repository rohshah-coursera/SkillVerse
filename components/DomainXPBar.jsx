import './DomainXPBar.css'

function DomainXPBar({ domain, xp, level, isVisible }) {
  const getXPForLevel = (level) => {
    return Math.floor(100 * Math.pow(1.5, level))
  }

  const getXPProgress = () => {
    const currentLevel = level || 0
    const currentXP = xp || 0
    
    // Calculate total XP needed for current level
    let totalXPForCurrentLevel = 0
    for (let i = 0; i < currentLevel; i++) {
      totalXPForCurrentLevel += getXPForLevel(i)
    }
    
    // Calculate total XP needed for next level
    const totalXPForNextLevel = totalXPForCurrentLevel + getXPForLevel(currentLevel)
    
    // Calculate progress
    const xpProgress = currentXP - totalXPForCurrentLevel
    const xpNeeded = totalXPForNextLevel - totalXPForCurrentLevel
    const percentage = (xpProgress / xpNeeded) * 100
    
    return { 
      xpProgress: Math.max(0, xpProgress), 
      xpNeeded, 
      percentage: Math.min(100, Math.max(0, percentage)) 
    }
  }

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

  const progress = getXPProgress()
  const color = domainColors[domain] || '#0056d2'
  const icon = domainIcons[domain] || '⭐'

  if (!isVisible) return null

  return (
    <div className="domain-xp-bar-container">
      <div className="domain-xp-bar-header">
        <span className="domain-xp-icon">{icon}</span>
        <span className="domain-xp-name">{domain}</span>
        <span className="domain-xp-level">Lv.{level}</span>
        <span className="domain-xp-amount">{xp.toLocaleString()} XP</span>
      </div>
      <div className="domain-xp-bar-wrapper">
        <div 
          className="domain-xp-bar"
          style={{
            width: `${progress.percentage}%`,
            backgroundColor: color
          }}
        ></div>
      </div>
      <div className="domain-xp-bar-text">
        {progress.xpProgress} / {progress.xpNeeded} XP to Level {level + 1}
      </div>
    </div>
  )
}

export default DomainXPBar

