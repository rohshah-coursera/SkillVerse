import { useState, useEffect } from 'react'
import SkillTree from './components/SkillTree'
import SkillGraph from './components/SkillGraph'
import Courses from './components/Courses'
import CourseDetail from './components/CourseDetail'
import Profile from './components/Profile'
import ProfileButton from './components/ProfileButton'
import DomainXPBar from './components/DomainXPBar'
import LevelUpNotification from './components/LevelUpNotification'
import { badges } from './data/courses'
import './App.css'

const STORAGE_KEY = 'career_skills_data'
const XP_STORAGE_KEY = 'career_skills_xp'
const LEVEL_STORAGE_KEY = 'career_skills_levels'
const COMPLETED_COURSES_KEY = 'completed_courses'
const EARNED_BADGES_KEY = 'earned_badges'
const SKILL_LEVELS_KEY = 'skill_levels'
const DISCOVERED_SKILLS_KEY = 'discovered_skills'

function App() {
  const [skillsData, setSkillsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('')
  const [domainXP, setDomainXP] = useState({})
  const [domainLevels, setDomainLevels] = useState({})
  const [showProfile, setShowProfile] = useState(false)
  const [levelUpNotification, setLevelUpNotification] = useState(null)
  const [visibleXPBar, setVisibleXPBar] = useState(null)
  const [lastClickedSkill, setLastClickedSkill] = useState(null)
  const [currentView, setCurrentView] = useState('skill-tree') // 'skill-tree', 'courses', 'course-detail'
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [completedCourses, setCompletedCourses] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])
  const [skillLevels, setSkillLevels] = useState({})
  const [discoveredSkills, setDiscoveredSkills] = useState({})

  // Load data from localStorage or JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load XP and levels
        const savedXP = localStorage.getItem(XP_STORAGE_KEY)
        const savedLevels = localStorage.getItem(LEVEL_STORAGE_KEY)
        const savedCompletedCourses = localStorage.getItem(COMPLETED_COURSES_KEY)
        const savedBadges = localStorage.getItem(EARNED_BADGES_KEY)
        const savedSkillLevels = localStorage.getItem(SKILL_LEVELS_KEY)
        const savedDiscoveredSkills = localStorage.getItem(DISCOVERED_SKILLS_KEY)
        
        if (savedXP) {
          setDomainXP(JSON.parse(savedXP))
        }
        if (savedLevels) {
          setDomainLevels(JSON.parse(savedLevels))
        }
        if (savedCompletedCourses) {
          setCompletedCourses(JSON.parse(savedCompletedCourses))
        }
        if (savedBadges) {
          setEarnedBadges(JSON.parse(savedBadges))
        }
        if (savedSkillLevels) {
          setSkillLevels(JSON.parse(savedSkillLevels))
        }
        if (savedDiscoveredSkills) {
          setDiscoveredSkills(JSON.parse(savedDiscoveredSkills))
        }

        // Try to load from localStorage first
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
          const parsed = JSON.parse(savedData)
          setSkillsData(parsed)
          setLoading(false)
          return
        }

        // Otherwise load from JSON file
        const response = await fetch('/career_domains_skills.json')
        const data = await response.json()
        
        // Initialize completed field for all skills if not present
        const initializedData = { ...data }
        Object.keys(initializedData['career domains']).forEach(domain => {
          Object.keys(initializedData['career domains'][domain]).forEach(skill => {
            if (!initializedData['career domains'][domain][skill].hasOwnProperty('completed')) {
              initializedData['career domains'][domain][skill].completed = false
            }
          })
        })
        
        setSkillsData(initializedData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initializedData))
        setLoading(false)
      } catch (err) {
        console.error('Error loading skills data:', err)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate XP based on relevance and popularity
  const calculateXP = (popularity, relevance) => {
    return Math.floor((popularity + relevance) * 5)
  }

  // Calculate level from XP
  const calculateLevel = (xp) => {
    if (xp === 0) return 0
    let level = 0
    let totalXP = 0
    while (totalXP <= xp) {
      const xpForThisLevel = Math.floor(100 * Math.pow(1.5, level))
      totalXP += xpForThisLevel
      if (totalXP <= xp) {
        level++
      } else {
        break
      }
    }
    return level
  }

  // Check if level up occurred
  const checkLevelUp = (domain, newXP, oldLevel) => {
    const newLevel = calculateLevel(newXP)
    if (newLevel > oldLevel) {
      setLevelUpNotification({ domain, level: newLevel })
      setTimeout(() => {
        setLevelUpNotification(null)
      }, 3000)
      return newLevel
    }
    return oldLevel
  }

  const handleSkillToggle = (domain, skillName, completed) => {
    setSkillsData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)) // Deep copy
      const skill = newData['career domains'][domain][skillName]
      const wasCompleted = skill.completed
      skill.completed = completed
      
      // Calculate XP gain/loss
      if (completed && !wasCompleted) {
        const xpGain = calculateXP(skill.popularity, skill.relevance)
        const currentXP = domainXP[domain] || 0
        const currentLevel = domainLevels[domain] || 0
        const newXP = currentXP + xpGain
        const newLevel = checkLevelUp(domain, newXP, currentLevel)
        
        // Mark skill as discovered
        const skillKey = `${domain}:${skillName}`
        setDiscoveredSkills(prev => {
          const updated = { ...prev, [skillKey]: true }
          localStorage.setItem(DISCOVERED_SKILLS_KEY, JSON.stringify(updated))
          return updated
        })
        
        // Update skill level
        const currentSkillLevel = skillLevels[skillKey] || 0
        const skillXP = (skillLevels[`${skillKey}:xp`] || 0) + xpGain
        const newSkillLevel = calculateLevel(skillXP)
        
        setSkillLevels(prev => {
          const updated = { 
            ...prev, 
            [skillKey]: newSkillLevel,
            [`${skillKey}:xp`]: skillXP
          }
          localStorage.setItem(SKILL_LEVELS_KEY, JSON.stringify(updated))
          return updated
        })
        
        // Update XP and levels
        setDomainXP(prev => {
          const updated = { ...prev, [domain]: newXP }
          localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        
        setDomainLevels(prev => {
          const updated = { ...prev, [domain]: newLevel }
          localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        
        // Show XP bar for this domain
        setVisibleXPBar(domain)
        setLastClickedSkill({ domain, skillName, xpGain })
        
        // Hide XP bar after 5 seconds
        setTimeout(() => {
          setVisibleXPBar(null)
        }, 5000)
      } else if (!completed && wasCompleted) {
        // Remove XP when unchecking
        const xpLoss = calculateXP(skill.popularity, skill.relevance)
        const currentXP = domainXP[domain] || 0
        const newXP = Math.max(0, currentXP - xpLoss)
        const newLevel = calculateLevel(newXP)
        
        setDomainXP(prev => {
          const updated = { ...prev, [domain]: newXP }
          localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        
        setDomainLevels(prev => {
          const updated = { ...prev, [domain]: newLevel }
          localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
      }
      
      // Save to localStorage automatically
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      
      setSaveStatus('✓ Auto-saved')
      setTimeout(() => setSaveStatus(''), 2000)
      
      return newData
    })
  }

  const updateJsonFile = (data) => {
    // Create a blob with the updated JSON (beautified)
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'career_domains_skills.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setSaveStatus('✓ Exported!')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  const handleExportJson = () => {
    if (skillsData) {
      updateJsonFile(skillsData)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      // Clear all localStorage keys
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(XP_STORAGE_KEY)
      localStorage.removeItem(LEVEL_STORAGE_KEY)
      localStorage.removeItem(COMPLETED_COURSES_KEY)
      localStorage.removeItem(EARNED_BADGES_KEY)
      localStorage.removeItem(SKILL_LEVELS_KEY)
      localStorage.removeItem(DISCOVERED_SKILLS_KEY)
      
      // Clear all course module completions
      if (skillsData && skillsData['career domains']) {
        Object.keys(skillsData['career domains']).forEach(domain => {
          // This will be handled by clearing all localStorage keys that start with 'course_'
          const keysToRemove = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith('course_')) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key))
        })
      }
      
      window.location.reload()
    }
  }

  const handleModuleComplete = (domain, skillName, module) => {
    // Mark skill as discovered first
    const skillKey = `${domain}:${skillName}`
    if (!discoveredSkills[skillKey]) {
      setDiscoveredSkills(prev => {
        const updated = { ...prev, [skillKey]: true }
        localStorage.setItem(DISCOVERED_SKILLS_KEY, JSON.stringify(updated))
        return updated
      })
    }
    
    // Complete the skill in the skill tree (this will also update XP and levels)
    handleSkillToggle(domain, skillName, true)
    
    // Check if course is completed
    if (selectedCourse) {
      const courseModules = selectedCourse.lessons.flatMap(lesson => 
        lesson.modules.map(m => `${lesson.id}-${m.id}`)
      )
      const completedModules = courseModules.filter(key => {
        const saved = localStorage.getItem(`course_${selectedCourse.id}_modules`)
        if (saved) {
          const completions = JSON.parse(saved)
          return completions[key]
        }
        return false
      })
      
      // Add current module if not already counted
      const currentModuleKey = `${module.lessonId || selectedCourse.lessons[0].id}-${module.id}`
      if (!completedModules.includes(currentModuleKey)) {
        completedModules.push(currentModuleKey)
      }
      
      // Check if all modules are completed
      if (completedModules.length === courseModules.length && !completedCourses.includes(selectedCourse.id)) {
        const newCompletedCourses = [...completedCourses, selectedCourse.id]
        setCompletedCourses(newCompletedCourses)
        localStorage.setItem(COMPLETED_COURSES_KEY, JSON.stringify(newCompletedCourses))
        
        // Award badge
        const newBadges = [...earnedBadges, selectedCourse.id]
        setEarnedBadges(newBadges)
        localStorage.setItem(EARNED_BADGES_KEY, JSON.stringify(newBadges))
        
        // Award bonus XP for course completion
        const bonusXP = 500
        const currentXP = domainXP[domain] || 0
        const currentLevel = domainLevels[domain] || 0
        const newXP = currentXP + bonusXP
        const newLevel = checkLevelUp(domain, newXP, currentLevel)
        
        setDomainXP(prev => {
          const updated = { ...prev, [domain]: newXP }
          localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        
        setDomainLevels(prev => {
          const updated = { ...prev, [domain]: newLevel }
          localStorage.setItem(LEVEL_STORAGE_KEY, JSON.stringify(updated))
          return updated
        })
        
        // Show level up notification for course completion
        setLevelUpNotification({ 
          domain, 
          level: newLevel,
          message: `Course Completed! +${bonusXP} XP Bonus!`
        })
      }
    }
  }

  const handleSelectCourse = (course) => {
    setSelectedCourse(course)
    setCurrentView('course-detail')
  }

  const handleBackToCourses = () => {
    setCurrentView('courses')
    setSelectedCourse(null)
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading skills data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <ProfileButton onClick={() => setShowProfile(true)} />
      
      {showProfile && (
        <Profile
          domainXP={domainXP}
          domainLevels={domainLevels}
          onClose={() => setShowProfile(false)}
          earnedBadges={earnedBadges}
          badges={badges}
          discoveredSkills={discoveredSkills}
          skillLevels={skillLevels}
          skillsData={skillsData}
        />
      )}

      {levelUpNotification && (
        <LevelUpNotification
          domain={levelUpNotification.domain}
          level={levelUpNotification.level}
          onComplete={() => setLevelUpNotification(null)}
        />
      )}

      {visibleXPBar && domainXP[visibleXPBar] !== undefined && (
        <DomainXPBar
          domain={visibleXPBar}
          xp={domainXP[visibleXPBar]}
          level={domainLevels[visibleXPBar] || 0}
          isVisible={true}
        />
      )}

      <header className="app-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="app-title">Career Skills Tree</h1>
            <p className="app-subtitle">Track your learning progress across different career domains</p>
          </div>
          <div className="header-actions">
            <div className="header-nav">
              <button 
                className={`nav-btn ${currentView === 'skill-tree' ? 'active' : ''}`}
                onClick={() => setCurrentView('skill-tree')}
              >
                Skills
              </button>
              <button 
                className={`nav-btn ${currentView === 'courses' || currentView === 'course-detail' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentView('courses')
                  setSelectedCourse(null)
                }}
              >
                Courses
              </button>
            </div>
            <button className="btn-export" onClick={handleExportJson}>
              💾 Export JSON
            </button>
            <button className="btn-reset" onClick={handleReset}>
              🔄 Reset
            </button>
            {saveStatus && <span className="save-status">{saveStatus}</span>}
          </div>
        </div>
      </header>
      <main className="app-main">
        {currentView === 'skill-tree' && skillsData && (
          <>
            <SkillGraph
              skillsData={skillsData}
              discoveredSkills={discoveredSkills}
              skillLevels={skillLevels}
            />
            <SkillTree 
              data={skillsData['career domains']} 
              onSkillToggle={handleSkillToggle}
              lastClickedSkill={lastClickedSkill}
              domainColors={{}}
            />
          </>
        )}
        {currentView === 'courses' && (
          <Courses
            onSelectCourse={handleSelectCourse}
            completedCourses={completedCourses}
            earnedBadges={earnedBadges}
          />
        )}
        {currentView === 'course-detail' && selectedCourse && (
          <CourseDetail
            course={selectedCourse}
            onBack={handleBackToCourses}
            onModuleComplete={handleModuleComplete}
            skillsData={skillsData}
            domainXP={domainXP}
            domainLevels={domainLevels}
          />
        )}
      </main>
    </div>
  )
}

export default App

