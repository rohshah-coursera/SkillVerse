import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Award, Zap, Flame, Star, Trophy, BookOpen } from 'lucide-react'
import { useGame } from '../context/GameContext'
import './NotificationPanel.css'

let notificationPanelState = { isOpen: false, setOpen: null }

export const setNotificationPanelOpen = (isOpen) => {
  if (notificationPanelState.setOpen) {
    notificationPanelState.setOpen(isOpen)
  }
}

const NotificationPanel = () => {
  const { notificationHistory } = useGame()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    notificationPanelState.setOpen = setIsOpen
    return () => {
      notificationPanelState.setOpen = null
    }
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'VIDEO_COMPLETED':
        return <Zap size={18} className="text-yellow-500" />
      case 'BADGE_UNLOCKED':
        return <Award size={18} className="text-purple-500" />
      case 'STREAK_ACHIEVEMENT':
        return <Flame size={18} className="text-orange-500" />
      case 'LEVEL_UP':
        return <Star size={18} className="text-blue-500" />
      case 'COURSE_COMPLETED':
        return <Trophy size={18} className="text-gold-500" />
      case 'SKILL_UNLOCKED':
        return <BookOpen size={18} className="text-green-500" />
      case 'MODULE_COMPLETED':
        return <Trophy size={18} className="text-purple-500" />
      default:
        return <Bell size={18} />
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.notification-panel-container')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const sortedHistory = [...(notificationHistory || [])].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  )

  return (
    <div className="notification-panel-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="notification-panel-header">
              <h3>Notification History</h3>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="notification-panel-content">
              {sortedHistory.length === 0 ? (
                <div className="empty-notifications">
                  <Bell size={48} className="empty-icon" />
                  <p>No notifications yet</p>
                  <span>Complete videos and tasks to see notifications here</span>
                </div>
              ) : (
                sortedHistory.map((notification) => {
                  const content = getNotificationContent(notification)
                  return (
                    <motion.div
                      key={notification.id}
                      className={`notification-item ${content.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="notification-item-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-item-content">
                        <div className="notification-item-title">{content.title}</div>
                        <div className="notification-item-message">{content.message}</div>
                        <div className="notification-item-time">
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationPanel

