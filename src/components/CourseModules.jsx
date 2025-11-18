import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { soundManager } from '../libs/soundManager'
import ParticleEffect from './ParticleEffect'
import './CourseModules.css'

const CourseModules = ({ course, onModuleComplete }) => {
  const { 
    completeVideo, 
    initializeCourseModules, 
    completeTask, 
    getCourseModules 
  } = useGame()
  const [expandedModules, setExpandedModules] = useState({})

  // Default modules structure - match Coursera style
  const defaultModules = [
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

  // Initialize modules on mount
  useEffect(() => {
    const courseModuleData = getCourseModules(course.id)
    if (!courseModuleData) {
      initializeCourseModules(course.id, defaultModules)
    }
  }, [course.id, initializeCourseModules, getCourseModules])

  // Get modules and task states from context
  const courseModuleData = getCourseModules(course.id)
  const modules = courseModuleData?.modules || defaultModules
  const taskStates = courseModuleData?.taskStates || {}

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const handleCompleteTask = async (moduleId, task) => {
    if (taskStates[task.id]) return

    // Play sound
    soundManager.playNotification('TASK_COMPLETE')

    // Complete task in context (saves to localStorage)
    completeTask(course.id, moduleId, task.id)

    // If it's a video task, trigger video completion
    if (task.type === 'video') {
      // For video tasks, use task.id as videoId and pass totalVideos
      completeVideo(course.id, task.id, course.totalVideos || 28)
    }

    // Check if module is complete
    const module = modules.find(m => m.id === moduleId)
    const allTasksComplete = module.tasks.every(t => taskStates[t.id] || t.id === task.id)

    if (allTasksComplete && onModuleComplete) {
      setTimeout(() => {
        soundManager.playNotification('COURSE_COMPLETED')
        onModuleComplete(moduleId)
      }, 500)
    }
  }

  const getTaskIcon = (type) => {
    switch (type) {
      case 'video':
        return '▶️'
      case 'reading':
        return '📖'
      case 'quiz':
        return '❓'
      case 'practice':
        return '💻'
      case 'assignment':
        return '📝'
      case 'lab':
        return '🔬'
      default:
        return '✓'
    }
  }

  const getTaskTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'var(--task-video)'
      case 'reading':
        return 'var(--task-reading)'
      case 'quiz':
        return 'var(--task-quiz)'
      case 'practice':
        return 'var(--task-practice)'
      case 'assignment':
        return 'var(--task-assignment)'
      case 'lab':
        return 'var(--task-lab)'
      default:
        return 'var(--task-default)'
    }
  }

  return (
    <div className="course-modules">
      <div className="modules-header">
        <h3>Course Modules</h3>
        <div className="modules-progress">
          {modules.filter(m => {
            const moduleTasks = m.tasks || []
            return moduleTasks.every(t => taskStates[t.id])
          }).length} / {modules.length} Complete
        </div>
      </div>

      <div className="modules-list">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules[module.id]
          const completedTasks = module.tasks.filter(t => taskStates[t.id]).length
          const totalTasks = module.tasks.length
          const moduleProgress = (completedTasks / totalTasks) * 100
          const isModuleComplete = completedTasks === totalTasks && totalTasks > 0

          return (
            <motion.div
              key={module.id}
              className={`module-card ${isModuleComplete ? 'module-complete' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
            >
              <div
                className="module-header"
                onClick={() => {
                  soundManager.playClick()
                  toggleModule(module.id)
                }}
                onMouseEnter={() => soundManager.playHover()}
              >
                <div className="module-header-left">
                  <motion.div
                    className="module-checkbox"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isModuleComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <CheckCircle2 size={24} className="check-icon" />
                      </motion.div>
                    ) : (
                      <Circle size={24} className="circle-icon" />
                    )}
                  </motion.div>
                  <div className="module-info">
                    <h4 className="module-title">{module.title}</h4>
                    <p className="module-description">{module.description}</p>
                    <div className="module-stats">
                      <span className="module-progress-text">
                        {completedTasks}/{totalTasks} tasks
                      </span>
                      <div className="module-progress-bar">
                        <motion.div
                          className="module-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${moduleProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="module-header-right">
                  {isModuleComplete && (
                    <motion.div
                      className="module-complete-badge"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                  )}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="module-tasks"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {module.tasks.map((task, taskIndex) => {
                      const isCompleted = taskStates[task.id]
                      return (
                        <motion.div
                          key={task.id}
                          className={`task-item ${isCompleted ? 'task-completed' : ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: taskIndex * 0.05 }}
                          onClick={() => !isCompleted && handleCompleteTask(module.id, task)}
                          onMouseEnter={() => !isCompleted && soundManager.playHover()}
                          style={{ cursor: isCompleted ? 'default' : 'pointer' }}
                        >
                          <div className="task-checkbox-wrapper">
                            <motion.div
                              className="task-checkbox"
                              whileHover={!isCompleted ? { scale: 1.1 } : {}}
                              whileTap={!isCompleted ? { scale: 0.9 } : {}}
                              style={{
                                borderColor: isCompleted ? getTaskTypeColor(task.type) : '#d1d5db',
                                backgroundColor: isCompleted ? getTaskTypeColor(task.type) : 'transparent',
                              }}
                            >
                              {isCompleted ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', stiffness: 500 }}
                                >
                                  <CheckCircle2 size={18} className="task-check-icon" />
                                </motion.div>
                              ) : (
                                <Circle size={18} className="task-circle-icon" />
                              )}
                            </motion.div>
                            {isCompleted && (
                              <motion.div
                                className="task-complete-particles"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                              >
                                <Zap size={12} />
                              </motion.div>
                            )}
                          </div>
                          <div className="task-content">
                            <div className="task-type-badge" style={{ backgroundColor: getTaskTypeColor(task.type) }}>
                              {getTaskIcon(task.type)}
                            </div>
                            <div className="task-details">
                              <div className="task-title">{task.title}</div>
                              <div className="task-meta">
                                <span className="task-type">{task.type}</span>
                                <span className="task-duration">{task.duration}</span>
                              </div>
                            </div>
                          </div>
                          {isCompleted && (
                            <>
                              <ParticleEffect type="xp" count={8} duration={0.5} />
                              <motion.div
                                className="task-xp-badge"
                                initial={{ scale: 0, y: -10, rotate: -10 }}
                                animate={{ scale: 1, y: 0, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                              >
                                +50 XP
                              </motion.div>
                            </>
                          )}
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default CourseModules

