import React from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Award, Zap, Flame } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { soundManager } from '../libs/soundManager'
import './CourseCard.css'

const CourseCard = ({ course, onClick }) => {
  const { badges, courses: gameCourses } = useGame()
  const gameCourse = gameCourses.find(c => c.id === course.id)
  
  // Get course-specific badges
  const courseBadges = badges.filter(badge => {
    if (badge.id === 'COURSE_25' || badge.id === 'COURSE_50' || badge.id === 'COURSE_75' || badge.id === 'COURSE_MASTER') {
      // These badges are course-specific, check if they match this course
      return true // For now, show all badges. Could be enhanced to filter by course
    }
    return true
  }).slice(0, 2) // Show max 2 badges per course
  return (
    <motion.div
      className="course-card"
      onClick={onClick}
      onMouseEnter={() => soundManager.playHover()}
      whileHover={{ y: -8, scale: 1.02, rotateY: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="course-thumbnail">
        <img src={course.thumbnail} alt={course.title} />
        <div className="course-overlay">
          <motion.button
            className="play-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={32} fill="white" />
          </motion.button>
        </div>
        <div className="course-level-badge">{course.level}</div>
      </div>

      <div className="course-content">
        <div className="course-header">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-instructor">by {course.instructor}</p>
        </div>

        <div className="course-progress">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <span className="progress-text">{course.progress}% Complete</span>
          </div>
        </div>

        <div className="course-stats">
          <div className="stat-item">
            <Clock size={16} />
            <span>{course.videosCompleted}/{course.totalVideos} Videos</span>
          </div>
          <div className="stat-item">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="course-gamification">
          <div className="gamification-item">
            <Zap size={16} className="text-yellow-500" />
            <span>{course.xp} XP</span>
          </div>
          <div className="gamification-item">
            <Flame size={16} className="text-orange-500" />
            <span>{course.streak} Day Streak</span>
          </div>
        </div>

        {courseBadges.length > 0 && (
          <div className="course-badges">
            {courseBadges.map(badge => (
              <motion.div
                key={badge.id}
                className="course-badge-item"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                title={badge.title}
              >
                <span className="badge-icon">{badge.icon}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CourseCard

