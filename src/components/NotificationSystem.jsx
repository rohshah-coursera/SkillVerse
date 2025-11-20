import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Zap, Flame, Star, Trophy, BookOpen } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { courses as coursesData } from '../../data/courses'
import { soundManager } from '../libs/soundManager'
import ParticleEffect from './ParticleEffect'
import './NotificationSystem.css'

const NotificationSystem = () => {
  const { notifications } = useGame()

  // Play sound when notification appears
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]
      soundManager.playNotification(latestNotification.type)
    }
  }, [notifications])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'VIDEO_COMPLETED':
        return <Zap size={22} style={{ color: '#4285F4', filter: 'drop-shadow(0 2px 4px rgba(66, 133, 244, 0.4))' }} />
      case 'BADGE_UNLOCKED':
        return <Award size={22} style={{ color: '#7b1fa2', filter: 'drop-shadow(0 2px 4px rgba(123, 31, 162, 0.4))' }} />
      case 'STREAK_ACHIEVEMENT':
        return <Flame size={22} style={{ color: '#f57c00', filter: 'drop-shadow(0 2px 4px rgba(245, 124, 0, 0.4))' }} />
      case 'LEVEL_UP':
        return <Star size={22} style={{ color: '#fbbf24', filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.4))' }} />
      case 'COURSE_COMPLETED':
        return <Trophy size={22} style={{ color: '#fbbf24', filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5))' }} />
      case 'SKILL_UNLOCKED':
        return <BookOpen size={22} style={{ color: '#10b981', filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.4))' }} />
      case 'MODULE_COMPLETED':
        return <Trophy size={22} style={{ color: '#8b5cf6', filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.4))' }} />
      default:
        return <Award size={22} style={{ color: '#6b7280', filter: 'drop-shadow(0 2px 4px rgba(107, 114, 128, 0.3))' }} />
    }
  }

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case 'VIDEO_COMPLETED':
        return {
          title: 'Video Completed! 🎉',
          message: `+${notification.data.xp} XP Earned • ${notification.data.streak} Day Streak 🔥`,
          category: 'xp',
          accentColor: '#4285F4', // Blue for XP
        }
      case 'BADGE_UNLOCKED':
        return {
          title: `🏆 Badge Unlocked: ${notification.data.title}`,
          message: `${notification.data.icon} ${notification.data.description}`,
          category: 'badge',
          accentColor: '#7b1fa2', // Purple for badges
        }
      case 'STREAK_ACHIEVEMENT':
        return {
          title: '🔥 Streak Milestone Achieved! 🔥',
          message: `Incredible! ${notification.data.streak} Day Streak! Keep the momentum going!`,
          category: 'xp',
          accentColor: '#f57c00', // Orange for streaks
        }
      case 'LEVEL_UP':
        return {
          title: '⭐ LEVEL UP! ⭐',
          message: `Congratulations! You've reached Level ${notification.data.level}! New powers unlocked!`,
          category: 'xp',
          accentColor: '#fbbf24', // Gold for level up
        }
      case 'COURSE_COMPLETED':
        // Get course name from courses.js
        let courseName = 'Course'
        if (notification.data.courseId) {
          for (const domain of Object.keys(coursesData)) {
            const course = coursesData[domain].find(c => c.id === notification.data.courseId)
            if (course) {
              courseName = course.title
              break
            }
          }
        }
        return {
          title: '🏆 COURSE COMPLETED! 🏆',
          message: `${courseName} • ${notification.data.badges || 3} Epic Badges Unlocked! You're a champion!`,
          category: 'badge',
          accentColor: '#fbbf24', // Gold for course completion
        }
      case 'SKILL_UNLOCKED':
        return {
          title: `✨ Skill Unlocked: ${notification.data.title} ✨`,
          message: `${notification.data.icon} ${notification.data.description} • Your skill tree grows!`,
          category: 'skill',
          accentColor: '#10b981', // Green for skills
        }
      case 'MODULE_COMPLETED':
        return {
          title: '🎊 Module Mastered! 🎊',
          message: `${notification.data.moduleTitle} • +${notification.data.xp} MEGA XP! You're unstoppable!`,
          category: 'xp',
          accentColor: '#8b5cf6', // Purple for module completion
        }
      default:
        return {
          title: 'Notification',
          message: 'Something amazing happened!',
          category: 'xp',
          accentColor: '#6b7280', // Gray for default
        }
    }
  }

  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map((notification) => {
          const content = getNotificationContent(notification)
          return (
            <motion.div
              key={notification.id}
              className={`notification notification-${content.category}`}
              style={{
                '--accent-color': content.accentColor,
              }}
              initial={{ opacity: 0, y: -50, x: 100, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: 100, scale: 0.8, rotate: 5 }}
              transition={{ 
                type: 'spring', 
                damping: 20, 
                stiffness: 300,
                rotate: { duration: 0.3 }
              }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {notification.type === 'BADGE_UNLOCKED' && (
                <ParticleEffect type="badge" count={15} duration={0.8} />
              )}
              {notification.type === 'LEVEL_UP' && (
                <ParticleEffect type="level" count={20} duration={1} />
              )}
              {notification.type === 'VIDEO_COMPLETED' && (
                <ParticleEffect type="xp" count={10} duration={0.6} />
              )}
              {notification.type === 'MODULE_COMPLETED' && (
                <ParticleEffect type="badge" count={20} duration={1} />
              )}
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{content.title}</div>
                <div className="notification-message">{content.message}</div>
              </div>
              <motion.button
                className="notification-close"
                onClick={() => {
                  // Notification auto-removes, but allow manual close
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default NotificationSystem

