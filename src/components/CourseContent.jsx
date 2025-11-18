import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Play, BookOpen, CheckCircle2, Circle } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { soundManager } from '../libs/soundManager'
import './CourseContent.css'

const CourseContent = ({ course, selectedModule, onContentComplete }) => {
  const { completeVideo, getCourseModules, completeTask, initializeCourseModules } = useGame()
  const [moduleExpanded, setModuleExpanded] = useState(true)
  const [showLearningObjectives, setShowLearningObjectives] = useState(false)

  // Default modules structure
  // For demo course: 2 modules, 2 videos per module
  const getDefaultModules = (courseId) => {
    if (courseId === 'demo-course') {
      return [
        {
          id: 1,
          title: 'Module 1: Getting Started',
          description: 'Welcome to the demo course! Learn the basics and get familiar with the platform. Complete both videos in this module to earn mega XP and unlock the Module Master badge.',
          tasks: [
            { id: 1, title: 'Introduction to the Course', duration: '5 min', type: 'video' },
            { id: 2, title: 'Platform Overview and Navigation', duration: '8 min', type: 'video' },
          ],
          completed: false,
        },
        {
          id: 2,
          title: 'Module 2: Core Concepts',
          description: 'Dive deeper into the core concepts. Complete both videos to finish the course and unlock the Course Champion badge!',
          tasks: [
            { id: 3, title: 'Understanding Key Concepts', duration: '10 min', type: 'video' },
            { id: 4, title: 'Putting It All Together', duration: '12 min', type: 'video' },
          ],
          completed: false,
        },
      ]
    }
    
    // Default structure for other courses
    return [
      {
        id: 1,
        title: 'Get started with course fundamentals',
        description: 'Build your roadmap to great learning. Whether you\'re just starting or already progressing, we\'ll introduce key strategies to help you learn with confidence and guide your journey to success.',
        tasks: [
          { id: 1, title: 'Introduction to Course Content', duration: '2 min', type: 'video' },
          { id: 2, title: 'Welcome to the course', duration: '1 min', type: 'video' },
          { id: 3, title: 'Course Overview and Structure', duration: '8 min', type: 'reading' },
          { id: 4, title: 'Helpful resources and tips', duration: '4 min', type: 'reading' },
        ],
        completed: false,
      },
      {
        id: 2,
        title: 'Core Concepts and Fundamentals',
        description: 'Master the fundamental concepts and build a strong foundation for advanced topics.',
        tasks: [
          { id: 5, title: 'Understanding Key Concepts', duration: '12:45', type: 'video' },
          { id: 6, title: 'Fundamentals Deep Dive', duration: '20 min', type: 'reading' },
          { id: 7, title: 'Practice Exercise: Apply Concepts', duration: '15 min', type: 'practice' },
        ],
        completed: false,
      },
      {
        id: 3,
        title: 'Advanced Topics and Applications',
        description: 'Explore advanced techniques and real-world applications of the concepts learned.',
        tasks: [
          { id: 8, title: 'Advanced Techniques Explained', duration: '18:20', type: 'video' },
          { id: 9, title: 'Real-World Case Studies', duration: '25 min', type: 'reading' },
          { id: 10, title: 'Hands-On Project', duration: '45 min', type: 'assignment' },
        ],
        completed: false,
      },
      {
        id: 4,
        title: 'Capstone Project and Assessment',
        description: 'Complete your learning journey with a comprehensive capstone project.',
        tasks: [
          { id: 11, title: 'Capstone Project Overview', duration: '10 min', type: 'video' },
          { id: 12, title: 'Final Assessment', duration: '30 min', type: 'quiz' },
        ],
        completed: false,
      },
    ]
  }

  // Initialize modules on mount
  useEffect(() => {
    const courseModuleData = getCourseModules(course.id)
    if (!courseModuleData) {
      const modules = getDefaultModules(course.id)
      initializeCourseModules(course.id, modules)
    }
  }, [course.id, initializeCourseModules, getCourseModules])

  // Get module data from context
  const courseModuleData = getCourseModules(course.id)
  const modules = courseModuleData?.modules || getDefaultModules(course.id)
  const taskStates = courseModuleData?.taskStates || {}

  const currentModule = modules.find(m => m.id === selectedModule) || modules[0]

  if (!currentModule) {
    return <div className="loading-module">Loading module...</div>
  }

  // Calculate progress for current module
  const moduleTasks = currentModule.tasks || []
  const completedTasks = moduleTasks.filter(t => taskStates[t.id])
  const totalTasks = moduleTasks.length
  const videosLeft = moduleTasks.filter(t => t.type === 'video' && !taskStates[t.id]).length
  const readingsLeft = moduleTasks.filter(t => t.type === 'reading' && !taskStates[t.id]).length

  const handleContentClick = (task) => {
    if (taskStates[task.id]) return // Already completed

    // Play sound
    soundManager.playNotification('TASK_COMPLETE')

    // Complete task in context (saves to localStorage)
    completeTask(course.id, selectedModule, task.id)

    // If it's a video task, also trigger video completion
    if (task.type === 'video') {
      completeVideo(course.id, task.id, course.totalVideos || 28)
      soundManager.playNotification('VIDEO_COMPLETED')
    }

    onContentComplete?.(task)
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={16} />
      case 'reading':
        return <BookOpen size={16} />
      default:
        return <Circle size={16} />
    }
  }

  return (
    <div className="course-content">
      <div className="module-header-section">
        <button
          className="module-title-toggle"
          onClick={() => setModuleExpanded(!moduleExpanded)}
        >
          <h2>{currentModule.title || 'Get started with course content'}</h2>
          {moduleExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {moduleExpanded && (
          <motion.div
            className="module-progress-info"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {videosLeft > 0 && (
              <div className="progress-indicator">
                <Play size={16} />
                <span>{videosLeft} min of videos left</span>
              </div>
            )}
            {readingsLeft > 0 && (
              <div className="progress-indicator">
                <BookOpen size={16} />
                <span>{readingsLeft} min of readings left</span>
              </div>
            )}
          </motion.div>
        )}

        {moduleExpanded && (
          <motion.div
            className="module-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>
              {currentModule.description || 
                'Build your roadmap to great learning. Whether you\'re just starting or already progressing, ' +
                'we\'ll introduce key strategies to help you learn with confidence and guide your journey to success.'}
            </p>
            <button
              className="learning-objectives-link"
              onClick={() => setShowLearningObjectives(!showLearningObjectives)}
            >
              {showLearningObjectives ? 'Hide' : 'Show'} Learning Objectives
            </button>
            {showLearningObjectives && (
              <motion.ul
                className="learning-objectives"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <li>Understand the core concepts and fundamentals</li>
                <li>Apply practical techniques and methodologies</li>
                <li>Complete hands-on exercises and projects</li>
                <li>Demonstrate mastery through assessments</li>
              </motion.ul>
            )}
          </motion.div>
        )}
      </div>

      {moduleExpanded && (
        <div className="content-items">
          {moduleTasks.map((task, index) => {
            const isCompleted = taskStates[task.id]
            return (
              <motion.div
                key={task.id}
                className={`content-item ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isCompleted && handleContentClick(task)}
                style={{ cursor: isCompleted ? 'default' : 'pointer' }}
              >
                <div className="content-item-left">
                  <div className="content-icon-wrapper">
                    {getContentIcon(task.type)}
                  </div>
                  <div className="content-details">
                    <div className="content-title">{task.title}</div>
                    <div className="content-meta">
                      <span className="content-type">{task.type}</span>
                      <span className="content-duration">• {task.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="content-item-right">
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="content-check" />
                  ) : (
                    <button className="get-started-button">
                      Get started
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CourseContent

