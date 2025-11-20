import { useState, useEffect } from 'react'
import { courses } from '../data/courses'
import './Courses.css'

function Courses({ onSelectCourse, completedCourses, earnedBadges }) {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [allCourses, setAllCourses] = useState([])

  useEffect(() => {
    // Flatten all courses from all domains
    const flattened = []
    Object.keys(courses).forEach(domain => {
      courses[domain].forEach(course => {
        flattened.push({ ...course, domain })
      })
    })
    setAllCourses(flattened)
  }, [])

  const domains = Object.keys(courses)
  const displayCourses = selectedDomain ? courses[selectedDomain] : allCourses

  const getCompletionPercentage = (course) => {
    const totalModules = course.lessons.reduce((sum, lesson) => sum + lesson.modules.length, 0)
    const completedModules = course.lessons.reduce((sum, lesson) => 
      sum + lesson.modules.filter(m => m.completed).length, 0
    )
    return totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  }

  const isCourseCompleted = (courseId) => {
    return completedCourses && completedCourses.includes(courseId)
  }

  const hasBadge = (courseId) => {
    return earnedBadges && earnedBadges.includes(courseId)
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Browse Courses</h1>
        <p>Explore courses to enhance your skills and earn badges</p>
      </div>

      <div className="courses-filters">
        <button 
          className={`filter-btn ${selectedDomain === null ? 'active' : ''}`}
          onClick={() => setSelectedDomain(null)}
        >
          All Courses
        </button>
        {domains.map(domain => (
          <button
            key={domain}
            className={`filter-btn ${selectedDomain === domain ? 'active' : ''}`}
            onClick={() => setSelectedDomain(domain)}
          >
            {domain}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {displayCourses.map(course => {
          const completion = getCompletionPercentage(course)
          const completed = isCourseCompleted(course.id)
          const badge = hasBadge(course.id)

          return (
            <div 
              key={course.id} 
              className={`course-card ${completed ? 'completed' : ''}`}
              onClick={() => onSelectCourse(course)}
            >
              <div className="course-image">{course.image}</div>
              <div className="course-content">
                <div className="course-header">
                  <span className="course-level">{course.level}</span>
                  {badge && <span className="course-badge">🏆</span>}
                </div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="course-instructor">👤 {course.instructor}</span>
                  <span className="course-duration">⏱️ {course.duration}</span>
                </div>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{completion}% Complete</span>
                </div>
                {completed && (
                  <div className="course-completed-badge">
                    ✓ Course Completed
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Courses

