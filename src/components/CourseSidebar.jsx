import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, FileText, MessageSquare, Info, Award } from 'lucide-react'
import './CourseSidebar.css'

const CourseSidebar = ({ course, selectedModule, onModuleSelect }) => {
  const [courseMaterialExpanded, setCourseMaterialExpanded] = useState(true)

  // Get modules dynamically based on course
  const getModules = () => {
    if (course.id === 'demo-course') {
      return [
        { id: 1, title: 'Module 1: Getting Started' },
        { id: 2, title: 'Module 2: Core Concepts' },
      ]
    }
    return [
      { id: 1, title: 'Module 1: Introduction' },
      { id: 2, title: 'Module 2: Fundamentals' },
      { id: 3, title: 'Module 3: Advanced Topics' },
      { id: 4, title: 'Module 4: Capstone Project' },
    ]
  }

  const modules = getModules()

  // Get provider logo/initial (simplified - in real app would come from course data)
  const getProviderLogo = (instructor) => {
    // Simple logic to get first letter or use a default
    if (instructor.includes('Google')) return 'G'
    if (instructor.includes('Andrew')) return 'A'
    return instructor.charAt(0).toUpperCase()
  }

  return (
    <div className="course-sidebar">
      <div className="course-sidebar-header">
        <div className="provider-logo">
          <span>{getProviderLogo(course.instructor)}</span>
        </div>
        <div className="course-sidebar-title">
          <h3>{course.title}</h3>
          <p className="course-provider">{course.instructor}</p>
        </div>
      </div>

      <div className="course-sidebar-content">
        <div className="course-material-section">
          <button
            className="section-toggle"
            onClick={() => setCourseMaterialExpanded(!courseMaterialExpanded)}
          >
            <span>Course Material</span>
            {courseMaterialExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {courseMaterialExpanded && (
            <div className="module-list">
              {modules.map((module) => (
                <label
                  key={module.id}
                  className={`module-radio ${selectedModule === module.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="module"
                    value={module.id}
                    checked={selectedModule === module.id}
                    onChange={() => onModuleSelect(module.id)}
                  />
                  <span>{module.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="course-nav-links">
          <a href="#grades" className="nav-link">
            <Award size={18} />
            <span>Grades</span>
          </a>
          <a href="#notes" className="nav-link">
            <FileText size={18} />
            <span>Notes</span>
          </a>
          <a href="#messages" className="nav-link">
            <MessageSquare size={18} />
            <span>Messages</span>
            <span className="nav-badge">1</span>
          </a>
          <a href="#info" className="nav-link">
            <Info size={18} />
            <span>Course Info</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CourseSidebar

