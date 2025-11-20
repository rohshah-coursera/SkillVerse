import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import './SkillNode.css'

const getRatingColor = (rating) => {
  if (rating >= 9) return '#00a86b'
  if (rating >= 7) return '#f57c00'
  return '#757575'
}

const getRatingLabel = (rating) => {
  if (rating >= 9) return 'High'
  if (rating >= 7) return 'Medium'
  return 'Low'
}

function SkillNode({ skillName, skillData, isHovered, onHover, onLeave, onToggle, index, domainColor, isJustClicked, domainAccent }) {
  const { popularity, relevance, completed } = skillData
  const [showTooltip, setShowTooltip] = useState(false)
  const [isShining, setIsShining] = useState(false)

  useEffect(() => {
    if (isJustClicked) {
      setIsShining(true)
      const timer = setTimeout(() => {
        setIsShining(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isJustClicked])

  const handleCheckboxChange = useCallback((e) => {
    onToggle(e.target.checked)
  }, [onToggle])

  const handleMouseEnter = useCallback(() => {
    onHover(skillName)
    setShowTooltip(true)
  }, [onHover, skillName])

  const handleMouseLeave = useCallback(() => {
    onLeave()
    setShowTooltip(false)
  }, [onLeave])

  const popularityColor = useMemo(() => getRatingColor(popularity), [popularity])
  const relevanceColor = useMemo(() => getRatingColor(relevance), [relevance])
  const popularityLabel = useMemo(() => getRatingLabel(popularity), [popularity])
  const relevanceLabel = useMemo(() => getRatingLabel(relevance), [relevance])

  return (
    <div 
      className={`skill-node ${completed ? 'completed' : ''} ${isHovered ? 'hovered' : ''} ${isShining ? 'shining' : ''}`}
      style={isShining ? { '--shine-color': domainAccent || domainColor } : {}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="skill-node-content">
        <div className="skill-checkbox-wrapper">
          <input
            type="checkbox"
            id={`skill-${skillName}-${index}`}
            checked={completed || false}
            onChange={handleCheckboxChange}
            className="skill-checkbox"
          />
          <label 
            htmlFor={`skill-${skillName}-${index}`}
            className="skill-checkbox-label"
            style={{ 
              borderColor: domainColor,
              backgroundColor: completed ? domainColor : 'transparent'
            }}
          >
            {completed && (
              <svg className="checkmark" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </label>
        </div>
        <span className="skill-name">{skillName}</span>
      </div>

      {showTooltip && (
        <div 
          className="skill-tooltip"
          style={{ '--domain-color': domainColor }}
        >
          <div className="tooltip-header">
            <strong>{skillName}</strong>
          </div>
          <div className="tooltip-stats">
            <div 
              className="tooltip-stat"
              style={{ '--stat-color': popularityColor }}
            >
              <span className="tooltip-label">Popularity:</span>
              <span 
                className="tooltip-value" 
                style={{ color: popularityColor }}
              >
                {popularity}/10 ({popularityLabel})
              </span>
            </div>
            <div 
              className="tooltip-stat"
              style={{ '--stat-color': relevanceColor }}
            >
              <span className="tooltip-label">Relevance:</span>
              <span 
                className="tooltip-value" 
                style={{ color: relevanceColor }}
              >
                {relevance}/10 ({relevanceLabel})
              </span>
            </div>
          </div>
          <div 
            className="tooltip-status"
            style={{ '--status-color': completed ? '#4caf50' : '#f57c00' }}
          >
            Status: {completed ? '✓ Completed' : '○ In Progress'}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(SkillNode)

