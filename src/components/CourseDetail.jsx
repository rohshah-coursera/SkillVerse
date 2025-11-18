import { useState, useEffect } from 'react'
import './CourseDetail.css'

function CourseDetail({ course, onBack, onModuleComplete, skillsData, domainXP, domainLevels }) {
  const [expandedLessons, setExpandedLessons] = useState({})
  const [moduleCompletions, setModuleCompletions] = useState({})

  useEffect(() => {
    // Load module completions from localStorage
    const saved = localStorage.getItem(`course_${course.id}_modules`)
    if (saved) {
      setModuleCompletions(JSON.parse(saved))
    }
  }, [course.id])

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  const handleModuleClick = (module, lesson) => {
    const moduleKey = `${lesson.id}-${module.id}`
    const isCompleted = moduleCompletions[moduleKey] || false
    
    if (!isCompleted) {
      // Mark module as completed
      const newCompletions = { ...moduleCompletions, [moduleKey]: true }
      setModuleCompletions(newCompletions)
      localStorage.setItem(`course_${course.id}_modules`, JSON.stringify(newCompletions))
      
      // Check if skill exists and complete it
      if (skillsData && skillsData['career domains']) {
        const domain = Object.keys(skillsData['career domains']).find(d => 
          skillsData['career domains'][d][module.skillName]
        )
        
        if (domain && module.skillName) {
          onModuleComplete(domain, module.skillName, { ...module, lessonId: lesson.id })
        }
      }
    }
  }

  const getCourseProgress = () => {
    const totalModules = course.lessons.reduce((sum, lesson) => sum + lesson.modules.length, 0)
    const completedModules = Object.keys(moduleCompletions).filter(key => moduleCompletions[key]).length
    return totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  }

  const isModuleCompleted = (lessonId, moduleId) => {
    return moduleCompletions[`${lessonId}-${moduleId}`] || false
  }

  const isLessonCompleted = (lesson) => {
    return lesson.modules.every(module => isModuleCompleted(lesson.id, module.id))
  }

  const progress = getCourseProgress()

  return (
    <div className="course-detail-page">
      <button className="back-button" onClick={onBack}>
        ← Back to Courses
      </button>

      <div className="course-detail-header">
        <div className="course-detail-image">{course.image}</div>
        <div className="course-detail-info">
          <div className="course-detail-meta">
            <span className="course-level-badge">{course.level}</span>
            <span className="course-duration-badge">⏱️ {course.duration}</span>
          </div>
          <h1 className="course-detail-title">{course.title}</h1>
          <p className="course-detail-description">{course.description}</p>
          <div className="course-detail-instructor">
            <strong>Instructor:</strong> {course.instructor}
          </div>
          <div className="course-detail-progress">
            <div className="progress-header">
              <span>Course Progress</span>
              <span className="progress-percentage">{progress}%</span>
            </div>
            <div className="progress-bar-large">
              <div 
                className="progress-fill-large" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-lessons">
        <h2>Course Content</h2>
        {course.lessons.map((lesson, index) => {
          const isExpanded = expandedLessons[lesson.id]
          const lessonCompleted = isLessonCompleted(lesson)
          const lessonProgress = lesson.modules.filter(m => 
            isModuleCompleted(lesson.id, m.id)
          ).length / lesson.modules.length * 100

          return (
            <div key={lesson.id} className={`lesson-card ${lessonCompleted ? 'completed' : ''}`}>
              <div 
                className="lesson-header"
                onClick={() => toggleLesson(lesson.id)}
              >
                <div className="lesson-header-left">
                  <span className="lesson-number">{index + 1}</span>
                  <div className="lesson-info">
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <span className="lesson-modules-count">
                      {lesson.modules.length} modules
                    </span>
                  </div>
                </div>
                <div className="lesson-header-right">
                  <div className="lesson-progress-mini">
                    <div className="progress-bar-mini">
                      <div 
                        className="progress-fill-mini" 
                        style={{ width: `${lessonProgress}%` }}
                      ></div>
                    </div>
                    <span>{Math.round(lessonProgress)}%</span>
                  </div>
                  <span className="lesson-expand-icon">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="lesson-modules">
                  {lesson.modules.map((module) => {
                    const completed = isModuleCompleted(lesson.id, module.id)
                    const skillData = skillsData && skillsData['career domains'] 
                      ? Object.values(skillsData['career domains'])
                          .flatMap(d => Object.entries(d))
                          .find(([name]) => name === module.skillName)?.[1]
                      : null

                    return (
                      <div 
                        key={module.id}
                        className={`module-item ${completed ? 'completed' : ''}`}
                        onClick={() => handleModuleClick(module, lesson)}
                      >
                        <div className="module-checkbox">
                          {completed ? (
                            <div className="module-checkmark">✓</div>
                          ) : (
                            <div className="module-checkbox-empty"></div>
                          )}
                        </div>
                        <div className="module-content">
                          <div className="module-title">{module.skillName}</div>
                          {skillData && (
                            <div className="module-skill-info">
                              <span className="skill-popularity">
                                Popularity: {skillData.popularity}/10
                              </span>
                              <span className="skill-relevance">
                                Relevance: {skillData.relevance}/10
                              </span>
                            </div>
                          )}
                        </div>
                        {completed && <span className="module-badge">✓</span>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CourseDetail

