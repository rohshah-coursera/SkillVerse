import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Zap, Trophy, Award } from 'lucide-react'
import './StatPopup.css'

const StatPopup = ({ isOpen, onClose, type, value, label, icon: Icon }) => {
  const shareToLinkedIn = () => {
    let text = ''
    let emoji = ''
    
    switch (type) {
      case 'xp':
        text = `⚡ I've earned ${value.toLocaleString()} XP on my learning journey! Keep pushing forward! 🚀`
        emoji = '⚡'
        break
      case 'level':
        text = `🏆 I've reached Level ${value}! Leveling up my skills one day at a time! 💪`
        emoji = '🏆'
        break
      case 'badges':
        text = `🎖️ I've earned ${value} badges! Celebrating my learning achievements! 🌟`
        emoji = '🎖️'
        break
      default:
        text = `🎉 Check out my learning progress! 🚀`
    }
    
    const url = encodeURIComponent(window.location.href)
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    window.open(linkedInUrl, '_blank', 'width=600,height=400')
  }

  if (!isOpen) return null

  const getContent = () => {
    switch (type) {
      case 'xp':
        return {
          title: 'Total Experience Points',
          description: 'XP is earned by completing videos, modules, and courses. Keep learning to earn more!',
          tips: [
            'Complete videos to earn 50 XP each',
            'Finish modules to earn 100 XP each',
            'Maintain your streak for bonus rewards',
          ],
        }
      case 'level':
        return {
          title: 'Current Level',
          description: `You're at Level ${value}! Level up by earning XP and completing courses.`,
          tips: [
            'Each level requires more XP than the previous',
            'Higher levels unlock new skills and achievements',
            'Keep learning to reach the next level',
          ],
        }
      case 'badges':
        return {
          title: 'Badges Earned',
          description: `You've earned ${value} badges! Badges represent your learning milestones and achievements.`,
          tips: [
            'Complete courses to earn course badges',
            'Maintain streaks for streak badges',
            'Reach milestones for special achievements',
          ],
        }
      default:
        return {
          title: label,
          description: 'Track your learning progress and achievements.',
          tips: [],
        }
    }
  }

  const content = getContent()

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
          className="stat-popup"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <div className="popup-title-section">
              {Icon && <Icon size={24} className="popup-icon" />}
              <div>
                <h2 className="popup-title">{content.title}</h2>
                <p className="popup-subtitle">{content.description}</p>
              </div>
            </div>
            <button className="popup-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="stat-popup-content">
            <div className="stat-display">
              <div className="stat-large-value">
                {type === 'level' ? `Level ${value}` : value.toLocaleString()}
              </div>
              <div className="stat-large-label">{label}</div>
            </div>

            {content.tips.length > 0 && (
              <div className="tips-section">
                <h3 className="tips-title">💡 Tips</h3>
                <ul className="tips-list">
                  {content.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

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

export default StatPopup

