import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Search, User, Trophy, Zap } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { setNotificationPanelOpen } from './NotificationPanel'
import './Header.css'

const Header = () => {
  const { totalXP, level, notifications, notificationHistory } = useGame()

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <span className="logo-text">LearnQuest</span>
            <span className="logo-subtitle">Gaming Dashboard</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search courses, videos, or topics..."
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="stats-badge">
            <Zap size={18} />
            <span>{totalXP.toLocaleString()} XP</span>
          </div>
          <div className="stats-badge">
            <Trophy size={18} />
            <span>Level {level}</span>
          </div>
          <button 
            className="icon-button"
            onClick={() => setNotificationPanelOpen(true)}
          >
            <Bell size={22} />
            {(notifications.length > 0 || (notificationHistory && notificationHistory.length > 0)) && (
              <span className="notification-dot"></span>
            )}
          </button>
          <button className="avatar-button">
            <User size={22} />
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header

