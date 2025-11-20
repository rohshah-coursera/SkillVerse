import { useState, useCallback, useMemo } from 'react'
import DomainBranch from './DomainBranch'
import './SkillTree.css'

function SkillTree({ data, onSkillToggle, lastClickedSkill }) {
  const [expandedDomains, setExpandedDomains] = useState({})

  const toggleDomain = useCallback((domain) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }))
  }, [])

  const domains = useMemo(() => Object.keys(data), [data])

  return (
    <div className="skill-tree">
      <div className="tree-container">
        {domains.map((domain, index) => (
          <DomainBranch
            key={domain}
            domain={domain}
            skills={data[domain]}
            isExpanded={expandedDomains[domain] !== false}
            onToggle={() => toggleDomain(domain)}
            onSkillToggle={onSkillToggle}
            index={index}
            lastClickedSkill={lastClickedSkill}
          />
        ))}
      </div>
    </div>
  )
}

export default SkillTree

