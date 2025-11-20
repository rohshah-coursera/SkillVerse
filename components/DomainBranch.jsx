import { useState, useMemo, useCallback, memo } from 'react'
import SkillNode from './SkillNode'
import './DomainBranch.css'

function DomainBranch({ domain, skills, isExpanded, onToggle, onSkillToggle, index, lastClickedSkill }) {
  const [hoveredSkill, setHoveredSkill] = useState(null)

  const skillEntries = useMemo(() => Object.entries(skills), [skills])
  const { completedCount, totalCount, progressPercentage } = useMemo(() => {
    const completed = skillEntries.filter(([_, skill]) => skill.completed).length
    const total = skillEntries.length
    return {
      completedCount: completed,
      totalCount: total,
      progressPercentage: total > 0 ? (completed / total) * 100 : 0
    }
  }, [skillEntries])

  const handleHover = useCallback((skillName) => {
    setHoveredSkill(skillName)
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredSkill(null)
  }, [])

  const domainColors = [
    { primary: '#0056d2', secondary: '#e6f0ff', accent: '#003d82' }, // Data Science - Coursera Blue
    { primary: '#00a86b', secondary: '#e6f9f3', accent: '#007a4f' }, // IT - Green
    { primary: '#d32f2f', secondary: '#ffebee', accent: '#b71c1c' }, // Cybersecurity - Red
    { primary: '#f57c00', secondary: '#fff3e0', accent: '#e65100' }, // Healthcare - Orange
    { primary: '#7b1fa2', secondary: '#f3e5f5', accent: '#6a1b9a' }  // Sales - Purple
  ]

  const colors = domainColors[index % domainColors.length]

  return (
    <div className="domain-branch" style={{ '--domain-color': colors.primary, '--domain-bg': colors.secondary, '--domain-accent': colors.accent }}>
      <div 
        className="domain-header"
        onClick={onToggle}
      >
        <div className="domain-header-content">
          <div className="domain-title-section">
            <span className="domain-icon">{isExpanded ? '▼' : '▶'}</span>
            <h2 className="domain-title">{domain}</h2>
          </div>
          <div className="domain-stats">
            <span className="domain-progress">
              {completedCount} / {totalCount} skills
            </span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: colors.primary
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="domain-skills">
          <div className="skills-stem">
            {skillEntries.map(([skillName, skillData], skillIndex) => (
              <SkillNode
                key={`${domain}-${skillName}-${skillIndex}`}
                skillName={skillName}
                skillData={skillData}
                isHovered={hoveredSkill === skillName}
                onHover={handleHover}
                onLeave={handleLeave}
                onToggle={(completed) => onSkillToggle(domain, skillName, completed)}
                index={skillIndex}
                domainColor={colors.primary}
                domainAccent={colors.accent}
                isJustClicked={lastClickedSkill?.domain === domain && lastClickedSkill?.skillName === skillName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(DomainBranch)

