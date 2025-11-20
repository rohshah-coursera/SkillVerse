import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Trophy, Flame, Award, Target } from 'lucide-react'
import './GamifiedStats.css'

const GamifiedStats = ({ totalXP, level, streak, badgesCount, levelProgress, weeklyGoal, currentWeek, onStatClick }) => {
  return (
    <motion.div
      className="gamified-stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Row: XP, Level, Streak, Badges */}
      <div className="stats-row">
        <motion.div
          className="stat-item xp-stat clickable-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -4 }}
          onClick={() => onStatClick && onStatClick('xp')}
        >
          <div className="stat-icon-wrapper xp-icon">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalXP.toLocaleString()}</div>
            <div className="stat-label">Total XP</div>
          </div>
          <div className="stat-glow xp-glow"></div>
        </motion.div>

        <motion.div
          className="stat-item level-stat clickable-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -4 }}
          onClick={() => onStatClick && onStatClick('level')}
        >
          <div className="stat-icon-wrapper level-icon">
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">Level {level}</div>
            <div className="stat-label">Current Level</div>
          </div>
          <div className="stat-glow level-glow"></div>
        </motion.div>

        <motion.div
          className="stat-item streak-stat clickable-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -4 }}
          onClick={() => onStatClick && onStatClick('streak')}
        >
          <div className="stat-icon-wrapper streak-icon">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{streak} Days</div>
            <div className="stat-label">Streak</div>
          </div>
          <div className="stat-glow streak-glow"></div>
        </motion.div>

        <motion.div
          className="stat-item badges-stat clickable-stat"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -4 }}
          onClick={() => onStatClick && onStatClick('badges')}
        >
          <div className="stat-icon-wrapper badges-icon">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{badgesCount}</div>
            <div className="stat-label">Badges</div>
          </div>
          <div className="stat-glow badges-glow"></div>
        </motion.div>
      </div>

      {/* Bottom Row: Level Progress and Weekly Goal */}
      <div className="progress-row">
        <motion.div
          className="progress-card level-progress"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="progress-header">
            <div className="progress-icon-wrapper">
              <Trophy size={20} className="progress-icon" />
            </div>
            <div className="progress-title">
              <span className="progress-label">Level {level}</span>
              <span className="progress-subtitle">Progress to Level {level + 1}</span>
            </div>
            <span className="progress-percentage">{levelProgress}%</span>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill level-fill"
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
        </motion.div>

        <motion.div
          className="progress-card weekly-goal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="progress-header">
            <div className="progress-icon-wrapper">
              <Target size={20} className="progress-icon" />
            </div>
            <div className="progress-title">
              <span className="progress-label">Weekly Goal</span>
              <span className="progress-subtitle">{currentWeek} / {weeklyGoal} hours</span>
            </div>
            <span className="progress-percentage">{Math.round((currentWeek / weeklyGoal) * 100)}%</span>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill weekly-fill"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((currentWeek / weeklyGoal) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GamifiedStats

