import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Award, Zap, Flame } from 'lucide-react'
import './StatsPanel.css'

const StatsPanel = ({ stats }) => {
  const statsItems = [
    {
      icon: Zap,
      label: 'Total XP',
      value: stats.totalXP.toLocaleString(),
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Award,
      label: 'Level',
      value: stats.level,
      color: 'text-coursera-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Target,
      label: 'Courses',
      value: `${stats.coursesCompleted}/${stats.totalCourses}`,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${stats.streak} Days`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <motion.div
      className="stats-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="stats-grid">
        {statsItems.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.05, y: -4, rotateY: 5 }}
            >
              <div className={`stat-icon ${stat.bgColor}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="level-progress-card">
        <div className="level-progress-header">
          <div className="level-info">
            <span className="level-label">Level {stats.level}</span>
            <span className="level-xp">
              {stats.totalXP} / {stats.level * 200} XP
            </span>
          </div>
          <span className="level-percentage">{stats.levelProgress}%</span>
        </div>
        <div className="level-progress-bar">
          <motion.div
            className="level-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${stats.levelProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      <div className="weekly-goal-card">
        <div className="weekly-goal-header">
          <Target size={20} />
          <span>Weekly Learning Goal</span>
        </div>
        <div className="weekly-goal-progress">
          <div className="weekly-progress-bar">
            <motion.div
              className="weekly-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.currentWeek / stats.weeklyGoal) * 100}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          <div className="weekly-progress-text">
            <span>{stats.currentWeek} hours</span>
            <span>of {stats.weeklyGoal} hours</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatsPanel

