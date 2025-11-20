import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { soundManager } from '../libs/soundManager'
import { badges as courseBadgeDefinitions } from '../../data/courses'
import './CourseCard.css'

const CourseCard = ({ course, onClick }) => {
  const { badges, courseModules } = useGame()
  
  // Get real-time progress from courseModules (localStorage) based on actual course completion
  const courseData = useMemo(() => {
    const moduleData = courseModules[course.id]
    
    if (moduleData && moduleData.modules) {
      // Calculate progress from completed modules (actual course completion)
      const completedModules = moduleData.modules.filter(m => m.completed).length || 0
      const totalModules = moduleData.modules.length || 0
      const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
      
      return {
        progress,
      }
    }
    
    // Fallback to course prop data if no module data exists
    return {
      progress: course.progress || 0,
    }
  }, [courseModules, course])
  
  // Get course-specific badges from courses.js and match with earned badges
  const courseBadges = badges
    .filter(badge => {
      // Check if badge is for this course (from courses.js badge definitions)
      if (courseBadgeDefinitions[course.id]) {
        return badge.id.startsWith(course.id) || badge.courseId === course.id
      }
      // For generic badges, show course progress badges
      return badge.id === 'COURSE_25' || badge.id === 'COURSE_50' || badge.id === 'COURSE_75' || badge.id === 'COURSE_MASTER' || badge.id === 'COURSE_CHAMPION'
    })
    .slice(0, 2) // Show max 2 badges per course
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
                className={`progress-fill ${courseData.progress === 100 ? 'completed' : ''}`}
                initial={{ width: 0 }}
                animate={{ width: `${courseData.progress}%` }}
                transition={{ duration: 0.5 }}
                key={courseData.progress}
              />
            </div>
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

