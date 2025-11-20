import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { courses as coursesData, skills as skillsData } from '../../data/courses'
import './SkillsPanel.css'

const SkillsPanel = () => {
  const { skills, level, completedSkills } = useGame()

  // Get all unique skills from courses.js, organized by domain
  const allSkillsFromCourses = useMemo(() => {
    const skillMap = new Map()
    
    // Extract skills from courses.js modules
    Object.keys(coursesData).forEach(domain => {
      coursesData[domain].forEach(course => {
        course.lessons.forEach(lesson => {
          lesson.modules.forEach(module => {
            if (module.skillName) {
              const skillKey = `${domain}:${module.skillName}`
              if (!skillMap.has(skillKey)) {
                // Find skill details from skills export if available
                const skillDetails = skillsData[domain]?.find(s => s.name === module.skillName)
                skillMap.set(skillKey, {
                  id: skillKey,
                  title: module.skillName,
                  icon: '✨',
                  description: skillDetails?.description || `Learn ${module.skillName}`,
                  unlockLevel: skillDetails?.level || 1,
                  domain,
                })
              }
            }
          })
        })
      })
    })
    
    return Array.from(skillMap.values())
  }, [])

  // Combine with level-based skills (for backward compatibility)
  const levelBasedSkills = [
    {
      id: 'FOCUSED_LEARNER',
      title: 'Focused Learner',
      icon: '🎯',
      description: 'Unlock at Level 5',
      unlockLevel: 5,
    },
    {
      id: 'DEDICATED_STUDENT',
      title: 'Dedicated Student',
      icon: '📖',
      description: 'Unlock at Level 10',
      unlockLevel: 10,
    },
    {
      id: 'EXPERT_LEARNER',
      title: 'Expert Learner',
      icon: '🌟',
      description: 'Unlock at Level 15',
      unlockLevel: 15,
    },
    {
      id: 'MASTER_SCHOLAR',
      title: 'Master Scholar',
      icon: '👑',
      description: 'Unlock at Level 20',
      unlockLevel: 20,
    },
  ]

  // Calculate earned skills count (completed skills from courses.js)
  const earnedSkillsCount = useMemo(() => {
    if (!completedSkills || completedSkills.length === 0) return 0
    return completedSkills.length
  }, [completedSkills])

  // Show only earned skills (completed skills) in a single row
  const earnedSkills = useMemo(() => {
    if (!completedSkills || completedSkills.length === 0) return []
    
    return completedSkills
      .map(skillKey => {
        // Find the skill in allSkillsFromCourses
        const skill = allSkillsFromCourses.find(s => s.id === skillKey)
        if (skill) return skill
        
        // If not found in courses, check if it's a level-based skill
        const levelSkill = levelBasedSkills.find(s => s.id === skillKey)
        return levelSkill
      })
      .filter(Boolean)
      .slice(0, 8) // Limit to 8 for single row display
  }, [completedSkills, allSkillsFromCourses])

  const totalSkillsCount = allSkillsFromCourses.length + levelBasedSkills.length

  const isUnlocked = (skillId) => {
    // Check if skill is completed from courses.js
    if (completedSkills && completedSkills.includes(skillId)) {
      return true
    }
    // Check level-based skills
    if (skills.some(s => s.id === skillId)) {
      return true
    }
    return false
  }

  const canUnlock = (unlockLevel) => {
    return level >= unlockLevel
  }

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <h3 className="skills-title">Skills</h3>
        <span className="skills-count">{earnedSkillsCount}/{totalSkillsCount}</span>
      </div>

      <div className="skills-grid">
        {earnedSkills.length > 0 ? (
          earnedSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="skill-card unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="skill-icon unlocked-icon">{skill.icon}</div>
              <div className="skill-content">
                <div className="skill-title">{skill.title}</div>
                <div className="skill-description">{skill.description}</div>
              </div>
              <motion.div
                className="skill-glow"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(16, 185, 129, 0.3)',
                    '0 0 30px rgba(16, 185, 129, 0.5)',
                    '0 0 20px rgba(16, 185, 129, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="skill-badge">
                <Sparkles size={16} color="#10b981" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-skills-message">
            <p>Complete courses to earn skills!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillsPanel

