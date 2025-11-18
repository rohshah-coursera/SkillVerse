import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { useGame } from '../context/GameContext'
import './SkillsPanel.css'

const SkillsPanel = () => {
  const { skills, level } = useGame()

  const allSkills = [
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

  const isUnlocked = (skillId) => {
    return skills.some(s => s.id === skillId)
  }

  const canUnlock = (unlockLevel) => {
    return level >= unlockLevel
  }

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <h3 className="skills-title">Skills</h3>
        <span className="skills-count">{skills.length}/{allSkills.length}</span>
      </div>

      <div className="skills-grid">
        {allSkills.map((skill, index) => {
          const unlocked = isUnlocked(skill.id)
          const canUnlockNow = canUnlock(skill.unlockLevel)

          return (
            <motion.div
              key={skill.id}
              className={`skill-card ${unlocked ? 'unlocked' : ''} ${canUnlockNow && !unlocked ? 'can-unlock' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              {unlocked ? (
                <>
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
                    <Sparkles size={16} />
                  </div>
                </>
              ) : (
                <>
                  <div className="skill-icon locked-icon">
                    <Lock size={24} />
                  </div>
                  <div className="skill-content">
                    <div className="skill-title">{skill.title}</div>
                    <div className="skill-description">
                      {canUnlockNow ? 'Ready to unlock!' : `Level ${skill.unlockLevel} required`}
                    </div>
                    <div className="skill-progress">
                      <div className="skill-progress-bar">
                        <motion.div
                          className="skill-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((level / skill.unlockLevel) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="skill-progress-text">
                        Level {level} / {skill.unlockLevel}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default SkillsPanel

