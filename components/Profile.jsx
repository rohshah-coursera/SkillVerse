import './Profile.css'

function Profile({ domainXP, domainLevels, onClose, earnedBadges, badges, discoveredSkills, skillLevels, skillsData }) {
  const totalXP = Object.values(domainXP).reduce((sum, xp) => sum + xp, 0)
  const totalLevel = Object.values(domainLevels).reduce((sum, level) => sum + level, 0)

  const domainNames = {
    'Data Science': { color: '#0056d2', icon: '📊' },
    'IT': { color: '#00a86b', icon: '💻' },
    'Cybersecurity': { color: '#d32f2f', icon: '🔒' },
    'Healthcare': { color: '#f57c00', icon: '🏥' },
    'Sales': { color: '#7b1fa2', icon: '💼' }
  }

  const getXPForLevel = (level) => {
    return Math.floor(100 * Math.pow(1.5, level))
  }

  const getXPProgress = (domain) => {
    const currentLevel = domainLevels[domain] || 0
    const currentXP = domainXP[domain] || 0
    
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

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Your Progress</h2>
          <button className="profile-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="profile-content">
          <div className="profile-summary">
            <div className="profile-avatar-large">
              <span>👤</span>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Total XP</span>
                <span className="stat-value">{totalXP.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Level</span>
                <span className="stat-value">{totalLevel}</span>
              </div>
            </div>
          </div>

          {earnedBadges && earnedBadges.length > 0 && (
            <div className="badges-section">
              <h3>Earned Badges</h3>
              <div className="badges-grid">
                {earnedBadges.map(badgeId => {
                  const badge = badges && badges[badgeId]
                  return badge ? (
                    <div key={badgeId} className="badge-item">
                      <div className="badge-icon">{badge.icon}</div>
                      <div className="badge-name">{badge.name}</div>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}

          {discoveredSkills && Object.keys(discoveredSkills).length > 0 && (
            <div className="skills-section">
              <h3>Discovered Skills</h3>
              <div className="skills-list">
                {Object.keys(discoveredSkills).filter(key => discoveredSkills[key]).map(skillKey => {
                  const [domain, skillName] = skillKey.split(':')
                  const level = skillLevels[skillKey] || 0
                  const skillXP = skillLevels[`${skillKey}:xp`] || 0
                  const domainInfo = domainNames[domain]
                  
                  if (!domainInfo) return null
                  
                  return (
                    <div key={skillKey} className="skill-item">
                      <div className="skill-item-header">
                        <span className="skill-icon">{domainInfo.icon}</span>
                        <div className="skill-item-info">
                          <span className="skill-item-name">{skillName}</span>
                          <span className="skill-item-domain">{domain}</span>
                        </div>
                        <span className="skill-item-level">Level {level}</span>
                      </div>
                      <div className="skill-item-xp">{skillXP} XP</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="domain-progress-list">
            <h3>Domain Progress</h3>
            {Object.keys(domainNames).map(domain => {
              const level = domainLevels[domain] || 0
              const xp = domainXP[domain] || 0
              const progress = getXPProgress(domain)
              const domainInfo = domainNames[domain]

              return (
                <div key={domain} className="domain-progress-item">
                  <div className="domain-progress-header">
                    <span className="domain-icon-large">{domainInfo.icon}</span>
                    <div className="domain-progress-info">
                      <span className="domain-name">{domain}</span>
                      <span className="domain-level">Level {level}</span>
                    </div>
                    <span className="domain-xp">{xp.toLocaleString()} XP</span>
                  </div>
                  <div className="domain-progress-bar-container">
                    <div 
                      className="domain-progress-bar"
                      style={{
                        width: `${progress.percentage}%`,
                        backgroundColor: domainInfo.color
                      }}
                    ></div>
                  </div>
                  <div className="domain-progress-text">
                    {progress.xpProgress} / {progress.xpNeeded} XP to Level {level + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

