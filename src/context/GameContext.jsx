import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { badges as courseBadges, courses } from '../../data/courses'

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
const XP_PER_MODULE = 100 // XP for module completion
const XP_PER_COURSE_COMPLETE = 0 // No XP bonus - badges are given instead
const LEVEL_UP_XP_MULTIPLIER = 200 // XP needed = level * 200
const BADGES_PER_COURSE = 3 // 3 badges per course completion

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
      totalXP: 1000,
      level: 1, // Will be recalculated from XP, but starting at 1
      courses: [],
      badges: [],
      skills: [],
      currentStreak: 1,
      lastCompletionDate: new Date().toISOString(),
      totalVideosCompleted: 0,
      coursesCompleted: 0,
      notifications: [],
      notificationHistory: [], // Store all notifications for history panel
      completedVideos: [], // Track completed videos to prevent duplicates (stored as array for JSON)
      completedSkills: [], // Track completed skills from courses.js (stored as array for JSON)
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

  // Add notification with duplicate prevention
  const addNotification = useCallback((type, data = {}) => {
    // Create a unique key for this notification to prevent duplicates
    const notificationKey = `${type}_${JSON.stringify(data)}`
    const notificationId = Date.now() + Math.random()
    
    setState(prev => {
      // Check if this exact notification already exists in current notifications
      const isDuplicate = prev.notifications.some(n => {
        const nKey = `${n.type}_${JSON.stringify(n.data)}`
        return nKey === notificationKey
      })
      
      if (isDuplicate) {
        return prev // Don't add duplicate
      }
      
      const notification = {
        id: notificationId,
        type,
        data,
        timestamp: new Date().toISOString(),
        key: notificationKey, // Store key for duplicate checking
      }
      
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
        notifications: prev.notifications.filter(n => n.id !== notificationId),
      }))
    }, 5000)
  }, [])

  // Award quarter-course badge (at 25% completion)
  const awardQuarterCourseBadge = useCallback((courseId) => {
    setState(prev => {
      const courseBadge = courseBadges[courseId]
      if (!courseBadge || !courseBadge.quarterCourse) {
        return prev
      }
      
      const badgeId = courseBadge.quarterCourse.id
      
      // Skip if already unlocked
      if (prev.badges.some(b => b.id === badgeId)) {
        return prev
      }
      
      const badge = {
        id: badgeId,
        title: courseBadge.quarterCourse.name,
        icon: courseBadge.quarterCourse.icon,
        description: courseBadge.quarterCourse.description,
        unlockedAt: new Date().toISOString(),
        courseId,
        type: 'quarterCourse',
      }
      
      setTimeout(() => {
        addNotification('BADGE_UNLOCKED', badge)
      }, 100)
      
      return {
        ...prev,
        badges: [...prev.badges, badge],
      }
    })
  }, [addNotification])

  // Award mid-course badge (at 50% completion)
  const awardMidCourseBadge = useCallback((courseId) => {
    setState(prev => {
      const courseBadge = courseBadges[courseId]
      if (!courseBadge || !courseBadge.midCourse) {
        return prev
      }
      
      const badgeId = courseBadge.midCourse.id
      
      // Skip if already unlocked
      if (prev.badges.some(b => b.id === badgeId)) {
        return prev
      }
      
      const badge = {
        id: badgeId,
        title: courseBadge.midCourse.name,
        icon: courseBadge.midCourse.icon,
        description: courseBadge.midCourse.description,
        unlockedAt: new Date().toISOString(),
        courseId,
        type: 'midCourse',
      }
      
      setTimeout(() => {
        addNotification('BADGE_UNLOCKED', badge)
      }, 100)
      
      return {
        ...prev,
        badges: [...prev.badges, badge],
      }
    })
  }, [addNotification])

  // Award three-quarter-course badge (at 75% completion)
  const awardThreeQuarterCourseBadge = useCallback((courseId) => {
    setState(prev => {
      const courseBadge = courseBadges[courseId]
      if (!courseBadge || !courseBadge.threeQuarterCourse) {
        return prev
      }
      
      const badgeId = courseBadge.threeQuarterCourse.id
      
      // Skip if already unlocked
      if (prev.badges.some(b => b.id === badgeId)) {
        return prev
      }
      
      const badge = {
        id: badgeId,
        title: courseBadge.threeQuarterCourse.name,
        icon: courseBadge.threeQuarterCourse.icon,
        description: courseBadge.threeQuarterCourse.description,
        unlockedAt: new Date().toISOString(),
        courseId,
        type: 'threeQuarterCourse',
      }
      
      setTimeout(() => {
        addNotification('BADGE_UNLOCKED', badge)
      }, 100)
      
      return {
        ...prev,
        badges: [...prev.badges, badge],
      }
    })
  }, [addNotification])

  // Award badges for course completion (end-course badges)
  const awardCourseCompletionBadges = useCallback((courseId, courseNumber) => {
    setState(prev => {
      const newBadges = []
      const baseBadgeIndex = (courseNumber - 1) * BADGES_PER_COURSE
      
      // Check if course has a badge definition in courses.js
      const courseBadge = courseBadges[courseId]
      
      // Award end-course badge if defined
      if (courseBadge && courseBadge.endCourse) {
        const badgeId = courseBadge.endCourse.id
        
        // Skip if already unlocked
        if (!prev.badges.some(b => b.id === badgeId)) {
          const badge = {
            id: badgeId,
            title: courseBadge.endCourse.name,
            icon: courseBadge.endCourse.icon,
            description: courseBadge.endCourse.description,
            unlockedAt: new Date().toISOString(),
            courseId,
            courseNumber,
            type: 'endCourse',
          }
          newBadges.push(badge)
          
          setTimeout(() => {
            addNotification('BADGE_UNLOCKED', badge)
          }, 100)
        }
      }
      
      // Also create 2 additional badges for the 3 total badges per course
      for (let i = 0; i < BADGES_PER_COURSE - 1; i++) {
        const badgeIndex = baseBadgeIndex + i
        const badgeId = courseBadge 
          ? `${courseId}_badge_${i + 1}` 
          : `COURSE_COMPLETION_${badgeIndex + 1}`
        
        // Skip if already unlocked
        if (prev.badges.some(b => b.id === badgeId)) {
          continue
        }
        
        const badge = {
          id: badgeId,
          title: courseBadge 
            ? `${courseBadge.name} ${i + 1 === 1 ? 'Badge' : `Badge ${i + 1}`}`
            : `Course ${courseNumber} Completion Badge ${i + 1}`,
          icon: courseBadge ? courseBadge.icon : (['🏆', '⭐', '🎖️'][i] || '🏅'),
          description: courseBadge 
            ? `${courseBadge.description} - Badge ${i + 1}`
            : `Earned for completing course #${courseNumber}`,
          unlockedAt: new Date().toISOString(),
          courseId,
          courseNumber,
        }
        newBadges.push(badge)
        
        // Notify badge unlock with delay to show them sequentially
        setTimeout(() => {
          addNotification('BADGE_UNLOCKED', badge)
        }, 200 + (i * 300))
      }

      if (newBadges.length > 0) {
        return {
          ...prev,
          badges: [...prev.badges, ...newBadges],
        }
      }
      return prev
    })
  }, [addNotification])

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
      // Check if this video has already been completed to prevent duplicates
      const videoKey = `${courseId}_${videoId}`
      const completedVideosSet = new Set(prev.completedVideos || [])
      
      if (completedVideosSet.has(videoKey)) {
        return prev // Video already completed, don't process again
      }
      
      // Mark video as completed
      completedVideosSet.add(videoKey)
      
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
        course.videosCompleted = Math.min(course.videosCompleted + 1, course.totalVideos)
        course.progress = Math.round((course.videosCompleted / course.totalVideos) * 100)
        course.lastVideoCompleted = videoId
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
        completedVideos: Array.from(completedVideosSet), // Store as array for JSON serialization
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

      // Notify course completion and award badges
      if (courseCompleted) {
        setTimeout(() => {
          addNotification('COURSE_COMPLETED', {
            courseId,
            badges: BADGES_PER_COURSE,
          })
          
          // Award badges for course completion (3 badges per course)
          const courseNumber = prev.coursesCompleted + 1
          awardCourseCompletionBadges(courseId, courseNumber)
        }, 500)
      }

      // Check badges and skills after state update
      setTimeout(() => {
        checkBadges(courseId)
        checkSkills()
      }, 200)

      return newState
    })
  }, [calculateLevel, addNotification, checkBadges, checkSkills, awardCourseCompletionBadges])

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
      
      // Calculate course progress for milestone badges
      const totalModules = updatedModules.length
      const completedModules = updatedModules.filter(m => m.completed).length
      const courseProgress = totalModules > 0 ? completedModules / totalModules : 0
      const prevProgress = prev.courseModules[courseId]?.progress || 0
      
      // Check milestone achievements
      const wasPastQuarter = prevProgress >= 0.25
      const isPastQuarter = courseProgress >= 0.25 && !wasPastQuarter
      
      const wasPastMidpoint = prevProgress >= 0.5
      const isPastMidpoint = courseProgress >= 0.5 && !wasPastMidpoint
      
      const wasPastThreeQuarter = prevProgress >= 0.75
      const isPastThreeQuarter = courseProgress >= 0.75 && !wasPastThreeQuarter

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

      // Auto-complete skills when tasks are completed (from courses.js)
      const completedSkillsSet = new Set(prev.completedSkills || [])
      
      // Find the course in courses.js to get skill names
      let courseData = null
      let courseDomain = null
      for (const domain of Object.keys(courses)) {
        courseData = courses[domain].find(c => c.id === courseId)
        if (courseData) {
          courseDomain = domain
          break
        }
      }
      
      // Mark skills from completed task as completed
      // In courses.js: lessons have modules with id and skillName
      // In component: modules have tasks with id
      // Try to match taskId to module.id in courses.js
      if (courseData && courseDomain && module) {
        // Find the lesson that contains this module
        courseData.lessons.forEach(lesson => {
          // Check if this lesson matches the moduleId (lesson.id might match moduleId)
          const lessonMatches = lesson.id === moduleId || lesson.id === `lesson-${moduleId}`
          
          if (lessonMatches) {
            // Find the module item that matches the taskId
            lesson.modules.forEach((moduleItem, index) => {
              // Try multiple matching strategies
              const matches = 
                moduleItem.id === taskId ||
                moduleItem.id === `module-${taskId}` ||
                moduleItem.id === taskId.toString() ||
                (module.tasks && module.tasks[index] && module.tasks[index].id === taskId)
              
              if (matches && moduleItem.skillName) {
                const skillKey = `${courseDomain}:${moduleItem.skillName}`
                completedSkillsSet.add(skillKey)
              }
            })
          }
        })
      }

      const newState = {
        ...prev,
        totalXP: newXP,
        level: calculateLevel(newXP),
        completedSkills: Array.from(completedSkillsSet),
        courseModules: {
          ...prev.courseModules,
          [courseId]: {
            ...courseModuleData,
            modules: updatedModules,
            taskStates: updatedTaskStates,
            lastUpdated: new Date().toISOString(),
            progress: courseProgress,
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

      // Award milestone badges at different completion percentages
      if (isPastQuarter) {
        setTimeout(() => {
          awardQuarterCourseBadge(courseId)
        }, 350)
      }
      
      if (isPastMidpoint) {
        setTimeout(() => {
          awardMidCourseBadge(courseId)
        }, 400)
      }
      
      if (isPastThreeQuarter) {
        setTimeout(() => {
          awardThreeQuarterCourseBadge(courseId)
        }, 450)
      }

      // Notify course completion and award badges
      if (courseJustCompleted) {
        const courseNumber = prev.coursesCompleted + 1
        setTimeout(() => {
          addNotification('COURSE_COMPLETED', {
            courseId,
            badges: BADGES_PER_COURSE,
          })
          
          // Award badges for course completion (3 badges per course)
          awardCourseCompletionBadges(courseId, courseNumber)
        }, 600)
      }

      // Check badges after state update
      setTimeout(() => {
        checkBadges(courseId, moduleId)
      }, 200)

      return newState
    })
  }, [calculateLevel, addNotification, checkBadges, awardCourseCompletionBadges, awardQuarterCourseBadge, awardMidCourseBadge, awardThreeQuarterCourseBadge])

  // Get course modules data
  const getCourseModules = useCallback((courseId) => {
    return state.courseModules[courseId] || null
  }, [state.courseModules])

  // Complete a skill (from SkillGraph)
  const completeSkill = useCallback((skillKey) => {
    setState(prev => {
      const completedSkillsSet = new Set(prev.completedSkills || [])
      if (completedSkillsSet.has(skillKey)) {
        return prev // Already completed
      }
      
      completedSkillsSet.add(skillKey)
      
      return {
        ...prev,
        completedSkills: Array.from(completedSkillsSet),
      }
    })
  }, [])

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
    completeSkill,
    levelProgress: state.totalXP % (state.level * LEVEL_UP_XP_MULTIPLIER),
    xpToNextLevel: state.level * LEVEL_UP_XP_MULTIPLIER,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

