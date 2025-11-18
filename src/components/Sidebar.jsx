import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Video, Award, Target, TrendingUp, Settings, X } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BookOpen, label: 'My Courses', count: 8 },
    { icon: Video, label: 'Watch History', count: 24 },
    { icon: Award, label: 'Achievements', count: 15 },
    { icon: Target, label: 'Learning Goals', count: 3 },
    { icon: TrendingUp, label: 'Progress', count: null },
    { icon: Settings, label: 'Settings', count: null },
  ]

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="sidebar"
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.label}
                className={`nav-item ${item.active ? 'active' : ''}`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.count !== null && (
                  <span className="nav-badge">{item.count}</span>
                )}
              </motion.button>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="streak-card">
            <div className="streak-icon">🔥</div>
            <div className="streak-info">
              <div className="streak-count">7 Day Streak</div>
              <div className="streak-label">Keep it up!</div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar

