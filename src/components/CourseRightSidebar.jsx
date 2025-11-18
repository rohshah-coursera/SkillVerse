import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Target } from 'lucide-react'
import './CourseRightSidebar.css'

const CourseRightSidebar = ({ course }) => {
  const [learningPlanSet, setLearningPlanSet] = useState(false)

  // Calculate course timeline
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 7) // Default 7 days from start

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="course-right-sidebar">
      <div className="learning-plan-card">
        <h3>Learning plan</h3>
        <p>
          Learners with a plan are 75% more likely to complete their courses. 
          Set a learning plan now to take charge of your learning journey and boost your success!
        </p>
        {!learningPlanSet ? (
          <motion.button
            className="set-plan-button"
            onClick={() => setLearningPlanSet(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Set your learning plan
          </motion.button>
        ) : (
          <motion.div
            className="plan-set-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Target size={20} />
            <span>Learning plan active!</span>
          </motion.div>
        )}
      </div>

      <div className="course-timeline-card">
        <h3>Course timeline</h3>
        <p className="timeline-subtitle">Personalize your milestones</p>
        <p className="timeline-description">
          Set a weekly goal to customize your course timeline. We'll tailor your end date 
          and assignment deadlines to match your learning schedule.
        </p>

        <div className="timeline-details">
          <div className="timeline-item">
            <Calendar size={18} />
            <div>
              <div className="timeline-label">Start date</div>
              <div className="timeline-value">{formatDate(startDate)}</div>
            </div>
          </div>

          <div className="timeline-item">
            <div>
              <div className="timeline-label">Your next deadline</div>
              <div className="timeline-value-link">
                <a href="#assignment">Course Challenge</a>
              </div>
              <div className="timeline-meta">
                <Clock size={14} />
                <span>Due in 3 days</span>
                <span className="timeline-badge">Graded Assignment</span>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <Calendar size={18} />
            <div>
              <div className="timeline-label">Estimated end date</div>
              <div className="timeline-value">{formatDate(endDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseRightSidebar

