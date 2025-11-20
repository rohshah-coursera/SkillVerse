import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import CourseCard from './CourseCard'
import GamifiedStats from './GamifiedStats'
import AchievementBadge from './AchievementBadge'
import SkillsPanel from './SkillsPanel'
import VideoPlayer from './VideoPlayer'
import SkillGraph from './SkillGraph'
import StreakPopup from './StreakPopup'
import StatPopup from './StatPopup'
import { useGame } from '../context/GameContext'
import { courses as coursesData, badges as courseBadgeDefinitions } from '../../data/courses'
import { TreePine } from 'lucide-react'
import { Zap, Trophy, Award } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const { initializeCourses, badges, currentStreak, totalXP, level, levelProgress, xpToNextLevel, courses: savedCourses, courseModules } = useGame()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showSkillTree, setShowSkillTree] = useState(false)
  const [showStreakPopup, setShowStreakPopup] = useState(false)
  const [showStatPopup, setShowStatPopup] = useState(null) // 'xp', 'level', 'badges', or null
  
  // Sort badges by criticality/hardness
  // Priority: Course completion badges > Mid-course badges > Generic badges
  // Within each category, sort by rarity (streak badges > course badges > milestone badges)
  const sortedBadges = useMemo(() => {
    return [...badges].sort((a, b) => {
      // Get badge definitions to determine type
      const aIsEndCourse = a.id && (a.id.includes('-end') || Object.values(courseBadgeDefinitions).some(badge => badge.endCourse?.id === a.id))
      const bIsEndCourse = b.id && (b.id.includes('-end') || Object.values(courseBadgeDefinitions).some(badge => badge.endCourse?.id === b.id))
      const aIsMidCourse = a.id && (a.id.includes('-mid') || Object.values(courseBadgeDefinitions).some(badge => badge.midCourse?.id === a.id))
      const bIsMidCourse = b.id && (b.id.includes('-mid') || Object.values(courseBadgeDefinitions).some(badge => badge.midCourse?.id === b.id))
      
      // Priority 1: End course badges (most critical)
      if (aIsEndCourse && !bIsEndCourse) return -1
      if (!aIsEndCourse && bIsEndCourse) return 1
      
      // Priority 2: Mid course badges
      if (aIsMidCourse && !bIsMidCourse) return -1
      if (!aIsMidCourse && bIsMidCourse) return 1
      
      // Priority 3: Streak badges (harder to achieve)
      const aIsStreak = a.id && (a.id.includes('STREAK') || a.id.includes('streak'))
      const bIsStreak = b.id && (b.id.includes('STREAK') || b.id.includes('streak'))
      if (aIsStreak && !bIsStreak) return -1
      if (!aIsStreak && bIsStreak) return 1
      
      // Priority 4: Course-related badges
      const aIsCourse = a.courseId || a.id?.includes('COURSE')
      const bIsCourse = b.courseId || b.id?.includes('COURSE')
      if (aIsCourse && !bIsCourse) return -1
      if (!aIsCourse && bIsCourse) return 1
      
      // Priority 5: Most recent first
      return new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0)
    })
  }, [badges])

  // Transform courses.js data to Dashboard format
  const baseCourses = useMemo(() => {
    const allCourses = []
    
    // Courses to exclude from MyCourses section
    const excludedCourseIds = ['healthcare-basics', 'sales-mastery']
    
    // Iterate through all domains in courses.js
    Object.keys(coursesData).forEach(domain => {
      coursesData[domain].forEach(course => {
        // Skip excluded courses
        if (excludedCourseIds.includes(course.id)) {
          return
        }
        // Calculate total videos/modules from lessons
        let totalModules = 0
        let totalVideos = 0
        
        course.lessons.forEach(lesson => {
          totalModules += lesson.modules.length
          // Estimate videos: assume 1-2 videos per module (use consistent calculation)
          lesson.modules.forEach((module, idx) => {
            // Use a deterministic calculation based on module index
            totalVideos += (idx % 2 === 0 ? 2 : 1) // Alternate between 1 and 2 videos
          })
        })
        
        // Get saved course data if exists
        const savedCourse = savedCourses.find(sc => sc.id === course.id)
        const courseModuleData = courseModules[course.id]
        
        // Calculate progress from courseModules
        let progress = 0
        let videosCompleted = 0
        
        if (courseModuleData) {
          const completedModules = courseModuleData.modules?.filter(m => m.completed).length || 0
          const totalModulesCount = courseModuleData.modules?.length || totalModules
          progress = totalModulesCount > 0 ? Math.round((completedModules / totalModulesCount) * 100) : 0
          
          // Count completed videos from taskStates
          const taskStates = courseModuleData.taskStates || {}
          videosCompleted = Object.values(taskStates).filter(completed => completed === true).length
        } else if (savedCourse) {
          progress = savedCourse.progress || 0
          videosCompleted = savedCourse.videosCompleted || 0
        }
        
        // Use image URL from courses.js, or fallback to default
        const thumbnail = course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop'
        
        allCourses.push({
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          progress,
          thumbnail,
          duration: course.duration,
          videosCompleted,
          totalVideos: savedCourse?.totalVideos || totalVideos || 10,
          level: course.level,
          xp: videosCompleted * 50, // 50 XP per video
          domain,
          description: course.description,
        })
      })
    })
    
    return allCourses
  }, [savedCourses, courseModules])

  // Merge with saved course data for progress tracking
  const courses = useMemo(() => {
    return baseCourses.map(course => {
      const savedCourse = savedCourses.find(sc => sc.id === course.id)
      if (savedCourse) {
        return {
          ...course,
          progress: savedCourse.progress || course.progress,
          videosCompleted: savedCourse.videosCompleted || course.videosCompleted,
          totalVideos: savedCourse.totalVideos || course.totalVideos,
        }
      }
      return course
    })
  }, [baseCourses, savedCourses])

  // Initialize courses in game context
  useEffect(() => {
    initializeCourses(baseCourses)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const weeklyGoal = 85
  const currentWeek = 72

  return (
    <div className="dashboard">
      {showSkillTree ? (
        <SkillGraph onBack={() => setShowSkillTree(false)} />
      ) : selectedCourse ? (
        <VideoPlayer
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
        />
      ) : (
        <>
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="dashboard-title">Welcome back! 👋</h1>
              <p className="dashboard-subtitle">
                Continue your learning journey and level up your skills
              </p>
            </div>
          </motion.div>

          {/* All Badges - Scrollable */}
          {sortedBadges.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Top Achievements</h2>
                <span className="section-count">{sortedBadges.length} Badges</span>
              </div>
              <div className="top-badges-scrollable">
                {sortedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="badge-item-wrapper"
                  >
                    <AchievementBadge 
                      achievement={{
                        id: badge.id,
                        title: badge.title,
                        icon: badge.icon,
                        unlocked: true,
                      }} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <GamifiedStats
            totalXP={totalXP}
            level={level}
            streak={currentStreak}
            badgesCount={badges.length}
            levelProgress={Math.round((levelProgress / xpToNextLevel) * 100)}
            weeklyGoal={weeklyGoal}
            currentWeek={currentWeek}
            onStatClick={(type) => {
              if (type === 'streak') {
                setShowStreakPopup(true)
              } else {
                setShowStatPopup(type)
              }
            }}
          />

          <StreakPopup
            isOpen={showStreakPopup}
            onClose={() => setShowStreakPopup(false)}
            streak={currentStreak}
          />

          <StatPopup
            isOpen={showStatPopup === 'xp'}
            onClose={() => setShowStatPopup(null)}
            type="xp"
            value={totalXP}
            label="Total XP"
            icon={Zap}
          />

          <StatPopup
            isOpen={showStatPopup === 'level'}
            onClose={() => setShowStatPopup(null)}
            type="level"
            value={level}
            label="Current Level"
            icon={Trophy}
          />

          <StatPopup
            isOpen={showStatPopup === 'badges'}
            onClose={() => setShowStatPopup(null)}
            type="badges"
            value={badges.length}
            label="Badges Earned"
            icon={Award}
          />

          <SkillsPanel />

          <div className="dashboard-section">
            <motion.button
              className="skill-tree-button"
              onClick={() => setShowSkillTree(true)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TreePine size={24} />
              <div>
                <div className="button-title">Explore Skill Tree</div>
                <div className="button-subtitle">3D Interactive AI Skills</div>
              </div>
            </motion.button>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">My Courses</h2>
              <span className="section-count">{courses.length} Active</span>
            </div>

            <div className="courses-grid">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard
                    course={course}
                    onClick={() => setSelectedCourse(course)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </>
      )}
    </div>
  )
}

export default Dashboard

