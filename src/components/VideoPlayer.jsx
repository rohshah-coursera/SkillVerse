import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import CourseSidebar from './CourseSidebar'
import CourseContent from './CourseContent'
import CourseRightSidebar from './CourseRightSidebar'
import './VideoPlayer.css'

const VideoPlayer = ({ course, onBack }) => {
  const [selectedModule, setSelectedModule] = useState(1)

  const handleContentComplete = (task) => {
    // Content completion is handled by CourseContent component
    console.log('Content completed:', task)
  }

  return (
    <motion.div
      className="course-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="course-page-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>
      </div>

      <div className="course-page-layout">
        <CourseSidebar
          course={course}
          selectedModule={selectedModule}
          onModuleSelect={setSelectedModule}
        />

        <CourseContent
          course={course}
          selectedModule={selectedModule}
          onContentComplete={handleContentComplete}
        />

        <CourseRightSidebar course={course} />
      </div>
    </motion.div>
  )
}

export default VideoPlayer

