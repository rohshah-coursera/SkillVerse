import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import './AchievementBadge.css'

const AchievementBadge = ({ achievement }) => {
  return (
    <motion.div
      className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {achievement.unlocked ? (
        <>
          <div className="achievement-icon">{achievement.icon}</div>
          <div className="achievement-title">{achievement.title}</div>
          <motion.div
            className="achievement-glow"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0, 86, 210, 0.3)',
                '0 0 30px rgba(0, 86, 210, 0.5)',
                '0 0 20px rgba(0, 86, 210, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      ) : (
        <>
          <div className="achievement-icon locked-icon">
            <Lock size={32} />
          </div>
          <div className="achievement-title locked-title">{achievement.title}</div>
        </>
      )}
    </motion.div>
  )
}

export default AchievementBadge

