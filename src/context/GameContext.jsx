import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const GameContext = createContext()

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

// Badge definitions inspired by Habitica
const BADGE_DEFINITIONS = {
  FIRST_STEPS: {
    id: 'FIRST_STEPS',
    title: 'First Steps',
    icon: '🎯',
    description: 'Complete your first video',
    condition: (state) => state.totalVideosCompleted >= 1,
  },
  WEEK_WARRIOR: {
    id: 'WEEK_WARRIOR',
    title: 'Week Warrior',
    icon: '🔥',
    description: 'Maintain a 7-day streak',
    condition: (state) => state.currentStreak >= 7,
  },
  KNOWLEDGE_SEEKER: {
    id: 'KNOWLEDGE_SEEKER',
    title: 'Knowledge Seeker',
    icon: '📚',
    description: 'Complete 10 videos',
    condition: (state) => state.totalVideosCompleted >= 10,
  },
  PERFECT_WEEK: {
    id: 'PERFECT_WEEK',
    title: 'Perfect Week',
    icon: '⭐',
    description: 'Complete videos 7 days in a row',
    condition: (state) => state.currentStreak >= 7,
  },
  COURSE_MASTER: {
    id: 'COURSE_MASTER',
    title: 'Course Master',
    icon: '🏆',
    description: 'Complete an entire course',
    condition: (state) => state.coursesCompleted >= 1,
  },
  STREAK_21: {
    id: 'STREAK_21',
    title: '21 Day Champion',
    icon: '💪',
    description: 'Maintain a 21-day streak',
    condition: (state) => state.currentStreak >= 21,
  },
  STREAK_30: {
    id: 'STREAK_30',
    title: 'Monthly Master',
    icon: '📅',
    description: 'Maintain a 30-day streak',
    condition: (state) => state.currentStreak >= 30,
  },
  COURSE_25: {
    id: 'COURSE_25',
    title: 'Quarter Complete',
    icon: '📊',
    description: 'Complete 25% of a course',
    condition: (state, courseId) => {
      const course = state.courses.find(c => c.id === courseId)
      return course && course.progress >= 25
    },
  },
  COURSE_50: {
    id: 'COURSE_50',
    title: 'Halfway Hero',
    icon: '🎖️',
    description: 'Complete 50% of a course',
    condition: (state, courseId) => {
      const course = state.courses.find(c => c.id === courseId)
      return course && course.progress >= 50
    },
  },
  COURSE_75: {
    id: 'COURSE_75',
    title: 'Almost There',
    icon: '🚀',
    description: 'Complete 75% of a course',
    condition: (state, courseId) => {
      const course = state.courses.find(c => c.id === courseId)
      return course && course.progress >= 75
    },
  },
  MULTI_COURSE: {
    id: 'MULTI_COURSE',
    title: 'Multi-Learner',
    icon: '🎓',
    description: 'Complete 3 courses',
    condition: (state) => state.coursesCompleted >= 3,
  },
  MODULE_MASTER: {
    id: 'MODULE_MASTER',
    title: 'Module Master',
    icon: '📦',
    description: 'Complete a module',
    condition: (state, courseId, moduleId) => {
      const courseModuleData = state.courseModules[courseId]
      if (!courseModuleData) return false
      const module = courseModuleData.modules.find(m => m.id === moduleId)
      return module && module.completed
    },
  },
  COURSE_CHAMPION: {
    id: 'COURSE_CHAMPION',
    title: 'Course Champion',
    icon: '👑',
    description: 'Complete an entire course',
    condition: (state, courseId) => {
      const course = state.courses.find(c => c.id === courseId)
      return course && course.completed
    },
  },
}

// Skills definitions
const SKILL_DEFINITIONS = {
  FOCUSED_LEARNER: {
    id: 'FOCUSED_LEARNER',
    title: 'Focused Learner',
    icon: '🎯',
    description: 'Unlock at Level 5',
    unlockLevel: 5,
  },
  DEDICATED_STUDENT: {
    id: 'DEDICATED_STUDENT',
    title: 'Dedicated Student',
    icon: '📖',
    description: 'Unlock at Level 10',
    unlockLevel: 10,
  },
  EXPERT_LEARNER: {
    id: 'EXPERT_LEARNER',
    title: 'Expert Learner',
    icon: '🌟',
    description: 'Unlock at Level 15',
    unlockLevel: 15,
  },
  MASTER_SCHOLAR: {
    id: 'MASTER_SCHOLAR',
    title: 'Master Scholar',
    icon: '👑',
    description: 'Unlock at Level 20',
    unlockLevel: 20,
  },
}

const XP_PER_VIDEO = 50
const XP_PER_MODULE = 200 // Mega XP for module completion
const XP_PER_COURSE_COMPLETE = 500
const LEVEL_UP_XP_MULTIPLIER = 200 // XP needed = level * 200

export const GameProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    // Load from localStorage or initialize
    const saved = localStorage.getItem('gameState')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved game state', e)
      }
    }
    
    return {
      totalXP: 1250,
      level: 12,
      courses: [],
      badges: [],
      skills: [],
      currentStreak: 7,
      lastCompletionDate: new Date().toISOString(),
      totalVideosCompleted: 0,
      coursesCompleted: 0,
      notifications: [],
      notificationHistory: [], // Store all notifications for history panel
      // Course modules and tasks tracking
      courseModules: {}, // { courseId: { modules: [...], taskStates: {...} } }
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state))
  }, [state])

  // Calculate level from XP
  const calculateLevel = useCallback((xp) => {
    let level = 1
    let xpNeeded = 0
    while (xpNeeded <= xp) {
      xpNeeded += level * LEVEL_UP_XP_MULTIPLIER
      if (xpNeeded <= xp) {
        level++
      }
    }
    return level
  }, [])

  // Check and update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastDate = state.lastCompletionDate ? new Date(state.lastCompletionDate).toISOString().split('T')[0] : null
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = state.currentStreak

    if (!lastDate) {
      // First time completing
      newStreak = 1
    } else if (lastDate === today) {
      // Already completed today, don't increment
      return state.currentStreak
    } else if (lastDate === yesterdayStr) {
      // Completed yesterday, continue streak
      newStreak = state.currentStreak + 1
    } else {
      // Streak broken, reset to 1
      newStreak = 1
    }

    return newStreak
  }, [state.currentStreak, state.lastCompletionDate])

  // Add notification
  const addNotification = useCallback((type, data = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      data,
      timestamp: new Date().toISOString(),
    }
    
    setState(prev => {
      // Add to current notifications
      const newNotifications = [...prev.notifications, notification]
      
      // Add to history (keep last 100)
      const newHistory = [...(prev.notificationHistory || []), notification]
      const trimmedHistory = newHistory.slice(-100)
      
      return {
        ...prev,
        notifications: newNotifications,
        notificationHistory: trimmedHistory,
      }
    })

    // Auto-remove from current notifications after 5 seconds
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== notification.id),
      }))
    }, 5000)
  }, [])

  // Check for badge unlocks
  const checkBadges = useCallback((courseId = null, moduleId = null) => {
    setState(prev => {
      const newBadges = []
      
      Object.values(BADGE_DEFINITIONS).forEach(badgeDef => {
        // Skip if already unlocked
        if (prev.badges.some(b => b.id === badgeDef.id)) {
          return
        }

        // Check condition
        if (badgeDef.condition(prev, courseId, moduleId)) {
          const badge = {
            id: badgeDef.id,
            title: badgeDef.title,
            icon: badgeDef.icon,
            description: badgeDef.description,
            unlockedAt: new Date().toISOString(),
          }
          newBadges.push(badge)
          setTimeout(() => {
            addNotification('BADGE_UNLOCKED', badge)
          }, 100)
        }
      })

      if (newBadges.length > 0) {
        return {
          ...prev,
          badges: [...prev.badges, ...newBadges],
        }
      }
      return prev
    })
  }, [addNotification])

  // Check for skill unlocks
  const checkSkills = useCallback(() => {
    const newSkills = []
    
    Object.values(SKILL_DEFINITIONS).forEach(skillDef => {
      // Skip if already unlocked
      if (state.skills.some(s => s.id === skillDef.id)) {
        return
      }

      // Check if level requirement met
      if (state.level >= skillDef.unlockLevel) {
        const skill = {
          id: skillDef.id,
          title: skillDef.title,
          icon: skillDef.icon,
          description: skillDef.description,
          unlockedAt: new Date().toISOString(),
        }
        newSkills.push(skill)
        addNotification('SKILL_UNLOCKED', skill)
      }
    })

    if (newSkills.length > 0) {
      setState(prev => ({
        ...prev,
        skills: [...prev.skills, ...newSkills],
      }))
    }
  }, [state.level, state.skills, addNotification])

  // Complete a video
  const completeVideo = useCallback((courseId, videoId, totalVideos = null) => {
    setState(prev => {
      const courses = [...prev.courses]
      const courseIndex = courses.findIndex(c => c.id === courseId)
      
      if (courseIndex === -1) {
        // Course not found, create it
        const courseTotalVideos = totalVideos || 28
        
        courses.push({
          id: courseId,
          videosCompleted: 1,
          totalVideos: courseTotalVideos,
          progress: Math.round((1 / courseTotalVideos) * 100),
          lastVideoCompleted: videoId,
          completed: false,
        })
      } else {
        // Update course
        const course = { ...courses[courseIndex] }
        if (!course.videosCompleted) course.videosCompleted = 0
        if (!course.totalVideos) course.totalVideos = totalVideos || 28
        
        // Only increment if this video hasn't been completed yet
        // Check if videoId is greater than last completed or if it's the next video
        const shouldIncrement = !course.lastVideoCompleted || 
          (videoId > course.lastVideoCompleted && videoId === course.videosCompleted + 1)
        
        if (shouldIncrement) {
          course.videosCompleted = Math.min(course.videosCompleted + 1, course.totalVideos)
          course.progress = Math.round((course.videosCompleted / course.totalVideos) * 100)
          course.lastVideoCompleted = videoId
        }
        courses[courseIndex] = course
      }

      // Update streak
      const today = new Date().toISOString()
      const lastDate = prev.lastCompletionDate ? new Date(prev.lastCompletionDate).toISOString().split('T')[0] : null
      const todayStr = today.split('T')[0]
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let newStreak = prev.currentStreak
      if (!lastDate) {
        newStreak = 1
      } else if (lastDate === todayStr) {
        newStreak = prev.currentStreak
      } else if (lastDate === yesterdayStr) {
        newStreak = prev.currentStreak + 1
      } else {
        newStreak = 1
      }

      // Calculate XP and level
      let newXP = prev.totalXP + XP_PER_VIDEO
      const newLevel = calculateLevel(newXP)
      const leveledUp = newLevel > prev.level

      // Check if course is completed
      const course = courses.find(c => c.id === courseId)
      const wasCompleted = prev.courses.find(c => c.id === courseId)?.completed
      const courseCompleted = course && course.videosCompleted === course.totalVideos && !wasCompleted
      
      if (courseCompleted) {
        newXP += XP_PER_COURSE_COMPLETE
        courses[courses.findIndex(c => c.id === courseId)].completed = true
      }

      const newState = {
        ...prev,
        courses,
        totalXP: newXP,
        level: calculateLevel(newXP),
        currentStreak: newStreak,
        lastCompletionDate: today,
        totalVideosCompleted: prev.totalVideosCompleted + 1,
        coursesCompleted: courseCompleted ? prev.coursesCompleted + 1 : prev.coursesCompleted,
      }

      // Check for streak achievement (every 21 days like Habitica)
      if (newStreak > 0 && newStreak % 21 === 0 && newStreak !== prev.currentStreak) {
        setTimeout(() => {
          addNotification('STREAK_ACHIEVEMENT', { streak: newStreak })
        }, 500)
      }

      // Notify video completion
      setTimeout(() => {
        addNotification('VIDEO_COMPLETED', {
          courseId,
          videoId,
          xp: XP_PER_VIDEO,
          streak: newStreak,
        })
      }, 100)

      // Notify level up
      if (leveledUp) {
        setTimeout(() => {
          addNotification('LEVEL_UP', {
            level: calculateLevel(newXP),
            xp: newXP,
          })
        }, 300)
      }

      // Notify course completion
      if (courseCompleted) {
        setTimeout(() => {
          addNotification('COURSE_COMPLETED', {
            courseId,
            xp: XP_PER_COURSE_COMPLETE,
          })
        }, 500)
      }

      // Check badges and skills after state update
      setTimeout(() => {
        checkBadges(courseId)
        checkSkills()
      }, 200)

      return newState
    })
  }, [calculateLevel, addNotification, checkBadges, checkSkills])

  // Initialize courses from Dashboard
  const initializeCourses = useCallback((courses) => {
    setState(prev => {
      const existingCourseIds = prev.courses.map(c => c.id)
      const newCourses = courses
        .filter(c => !existingCourseIds.includes(c.id))
        .map(c => ({
          id: c.id,
          videosCompleted: c.videosCompleted || 0,
          totalVideos: c.totalVideos || 28,
          progress: c.progress || 0,
          completed: false,
        }))
      
      return {
        ...prev,
        courses: [...prev.courses, ...newCourses],
      }
    })
  }, [])

  // Initialize course modules structure
  const initializeCourseModules = useCallback((courseId, modules) => {
    setState(prev => {
      const existing = prev.courseModules[courseId]
      if (existing) {
        return prev // Don't overwrite existing data
      }

      // Initialize task states for all modules
      const taskStates = {}
      modules.forEach(module => {
        module.tasks.forEach(task => {
          taskStates[task.id] = false
        })
      })

      return {
        ...prev,
        courseModules: {
          ...prev.courseModules,
          [courseId]: {
            modules,
            taskStates,
            lastUpdated: new Date().toISOString(),
          },
        },
      }
    })
  }, [])

  // Complete a task in a course module
  const completeTask = useCallback((courseId, moduleId, taskId) => {
    setState(prev => {
      const courseModuleData = prev.courseModules[courseId]
      if (!courseModuleData) {
        return prev
      }

      const updatedTaskStates = {
        ...courseModuleData.taskStates,
        [taskId]: true,
      }

      // Check if module is complete
      const module = courseModuleData.modules.find(m => m.id === moduleId)
      const wasModuleComplete = module?.completed || false
      const isModuleComplete = module && module.tasks.every(t => updatedTaskStates[t.id])
      const moduleJustCompleted = isModuleComplete && !wasModuleComplete

      // Update module completion status
      const updatedModules = courseModuleData.modules.map(m => {
        if (m.id === moduleId) {
          return { ...m, completed: isModuleComplete }
        }
        return m
      })

      // Check if course is complete (all modules done)
      const isCourseComplete = updatedModules.every(m => m.completed)
      const wasCourseComplete = prev.courses.find(c => c.id === courseId)?.completed
      const courseJustCompleted = isCourseComplete && !wasCourseComplete

      // Calculate XP - add mega XP for module completion
      let newXP = prev.totalXP
      if (moduleJustCompleted) {
        newXP += XP_PER_MODULE
      }

      // Add course completion bonus
      if (courseJustCompleted) {
        newXP += XP_PER_COURSE_COMPLETE
      }

      // Update course completion if needed
      const updatedCourses = prev.courses.map(c => {
        if (c.id === courseId && isCourseComplete && !wasCourseComplete) {
          return { ...c, completed: true }
        }
        return c
      })

      const newState = {
        ...prev,
        totalXP: newXP,
        level: calculateLevel(newXP),
        courseModules: {
          ...prev.courseModules,
          [courseId]: {
            ...courseModuleData,
            modules: updatedModules,
            taskStates: updatedTaskStates,
            lastUpdated: new Date().toISOString(),
          },
        },
        courses: updatedCourses,
        coursesCompleted: courseJustCompleted 
          ? prev.coursesCompleted + 1 
          : prev.coursesCompleted,
      }

      // Notify module completion with mega XP
      if (moduleJustCompleted) {
        setTimeout(() => {
          addNotification('MODULE_COMPLETED', {
            courseId,
            moduleId,
            moduleTitle: module.title,
            xp: XP_PER_MODULE,
          })
        }, 300)
      }

      // Notify course completion
      if (courseJustCompleted) {
        setTimeout(() => {
          addNotification('COURSE_COMPLETED', {
            courseId,
            xp: XP_PER_COURSE_COMPLETE,
          })
        }, 600)
      }

      // Check badges after state update
      setTimeout(() => {
        checkBadges(courseId, moduleId)
      }, 200)

      return newState
    })
  }, [calculateLevel, addNotification, checkBadges])

  // Get course modules data
  const getCourseModules = useCallback((courseId) => {
    return state.courseModules[courseId] || null
  }, [state.courseModules])

  const value = {
    ...state,
    completeVideo,
    initializeCourses,
    initializeCourseModules,
    completeTask,
    getCourseModules,
    addNotification,
    checkBadges,
    checkSkills,
    levelProgress: state.totalXP % (state.level * LEVEL_UP_XP_MULTIPLIER),
    xpToNextLevel: state.level * LEVEL_UP_XP_MULTIPLIER,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

