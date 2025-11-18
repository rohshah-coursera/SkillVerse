import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CourseCard from './CourseCard'
import GamifiedStats from './GamifiedStats'
import AchievementBadge from './AchievementBadge'
import SkillsPanel from './SkillsPanel'
import VideoPlayer from './VideoPlayer'
import SkillTree from './SkillTree'
import { useGame } from '../context/GameContext'
import { TreePine } from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const { initializeCourses, badges, currentStreak, totalXP, level, levelProgress, xpToNextLevel, courses: savedCourses } = useGame()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showSkillTree, setShowSkillTree] = useState(false)
  
  // Get top 5 badges (sorted by unlock date, most recent first)
  const topBadges = [...badges]
    .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0))
    .slice(0, 5)

  // Base courses data
  const baseCourses = [
    {
      id: 'demo-course',
      title: 'Demo Course: Quick Start Guide',
      instructor: 'LearnQuest Team',
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      duration: '1 week',
      videosCompleted: 0,
      totalVideos: 4, // 2 modules × 2 videos
      level: 'Beginner',
      xp: 0,
      streak: currentStreak,
      isDemo: true,
    },
    {
      id: 1,
      title: 'Machine Learning Specialization',
      instructor: 'Andrew Ng',
      progress: 65,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      duration: '12 weeks',
      videosCompleted: 18,
      totalVideos: 28,
      level: 'Intermediate',
      xp: 850,
      streak: currentStreak,
    },
    {
      id: 2,
      title: 'Full Stack Web Development',
      instructor: 'Colt Steele',
      progress: 42,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      duration: '8 weeks',
      videosCompleted: 12,
      totalVideos: 29,
      level: 'Beginner',
      xp: 520,
      streak: currentStreak,
    },
    {
      id: 3,
      title: 'Data Science with Python',
      instructor: 'Jose Portilla',
      progress: 88,
      thumbnail: 'https://images.unsplash.com/photo-1529107386315-e3a2d56bc433?w=400',
      duration: '10 weeks',
      videosCompleted: 25,
      totalVideos: 28,
      level: 'Advanced',
      xp: 1200,
      streak: currentStreak,
    },
    {
      id: 4,
      title: 'UI/UX Design Masterclass',
      instructor: 'Sarah Johnson',
      progress: 30,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      duration: '6 weeks',
      videosCompleted: 8,
      totalVideos: 26,
      level: 'Beginner',
      xp: 320,
      streak: currentStreak,
    },
  ]

  // Merge with saved course data
  const courses = baseCourses.map(course => {
    const savedCourse = savedCourses.find(sc => sc.id === course.id)
    if (savedCourse) {
      return {
        ...course,
        progress: savedCourse.progress || course.progress,
        videosCompleted: savedCourse.videosCompleted || course.videosCompleted,
      }
    }
    return course
  })

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
        <SkillTree onBack={() => setShowSkillTree(false)} />
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

          {/* Top 5 Badges */}
          {topBadges.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Top Achievements</h2>
              </div>
              <div className="top-badges-grid">
                {topBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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

