import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Zap, Flame, Star, Trophy, BookOpen } from 'lucide-react'
import { useGame } from '../context/GameContext'
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
        return <Zap size={20} className="text-yellow-500" />
      case 'BADGE_UNLOCKED':
        return <Award size={20} className="text-purple-500" />
      case 'STREAK_ACHIEVEMENT':
        return <Flame size={20} className="text-orange-500" />
      case 'LEVEL_UP':
        return <Star size={20} className="text-blue-500" />
      case 'COURSE_COMPLETED':
        return <Trophy size={20} className="text-gold-500" />
      case 'SKILL_UNLOCKED':
        return <BookOpen size={20} className="text-green-500" />
      case 'MODULE_COMPLETED':
        return <Trophy size={20} className="text-purple-500" />
      default:
        return <Award size={20} />
    }
  }

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case 'VIDEO_COMPLETED':
        return {
          title: 'Video Completed! 🎉',
          message: `+${notification.data.xp} XP • ${notification.data.streak} Day Streak`,
          color: 'bg-blue-500',
        }
      case 'BADGE_UNLOCKED':
        return {
          title: `Badge Unlocked: ${notification.data.title}`,
          message: `${notification.data.icon} ${notification.data.description}`,
          color: 'bg-purple-500',
        }
      case 'STREAK_ACHIEVEMENT':
        return {
          title: 'Streak Achievement! 🔥',
          message: `${notification.data.streak} Day Streak Milestone!`,
          color: 'bg-orange-500',
        }
      case 'LEVEL_UP':
        return {
          title: 'Level Up! ⭐',
          message: `You've reached Level ${notification.data.level}!`,
          color: 'bg-blue-600',
        }
      case 'COURSE_COMPLETED':
        return {
          title: 'Course Completed! 🏆',
          message: `+${notification.data.xp} XP Bonus!`,
          color: 'bg-gold-500',
        }
      case 'SKILL_UNLOCKED':
        return {
          title: `Skill Unlocked: ${notification.data.title}`,
          message: `${notification.data.icon} ${notification.data.description}`,
          color: 'bg-green-500',
        }
      case 'MODULE_COMPLETED':
        return {
          title: 'Module Completed! 🎊',
          message: `${notification.data.moduleTitle} • +${notification.data.xp} Mega XP!`,
          color: 'bg-purple-500',
        }
      default:
        return {
          title: 'Notification',
          message: 'Something happened!',
          color: 'bg-gray-500',
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
              className={`notification ${content.color}`}
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

