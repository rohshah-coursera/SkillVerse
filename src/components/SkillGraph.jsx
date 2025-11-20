import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { courses } from '../../data/courses'
import './SkillGraph.css'

const SkillGraph = ({ onBack }) => {
  const { courseModules, courses: completedCourses, addNotification, completedSkills: savedCompletedSkills, completeSkill } = useGame()
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [completedSkills, setCompletedSkills] = useState(new Set())
  const [discoveredSkills, setDiscoveredSkills] = useState(new Set())
  const [highlightDiscovered, setHighlightDiscovered] = useState(false)

  // Extract all unique skills from courses.js
  const skillsData = useMemo(() => {
    const skillsByDomain = {}
    
    Object.keys(courses).forEach(domain => {
      skillsByDomain[domain] = {}
      
      courses[domain].forEach(course => {
        course.lessons.forEach(lesson => {
          lesson.modules.forEach(module => {
            const skillName = module.skillName
            if (skillName) {
              if (!skillsByDomain[domain][skillName]) {
                skillsByDomain[domain][skillName] = {
                  courses: [],
                  completed: false,
                  popularity: 0,
                  relevance: 0
                }
              }
              skillsByDomain[domain][skillName].courses.push(course.id)
            }
          })
        })
      })
    })
    
    return { 'career domains': skillsByDomain }
  }, [])

  // Load completed skills from localStorage (via GameContext)
  useEffect(() => {
    const saved = new Set(savedCompletedSkills || [])
    setCompletedSkills(saved)
  }, [savedCompletedSkills])

  // Calculate completed and discovered skills from course modules
  useEffect(() => {
    const discovered = new Set()
    
    Object.keys(courseModules).forEach(courseId => {
      const courseModuleData = courseModules[courseId]
      if (!courseModuleData) return
      
      // Find the course in courses.js
      let courseData = null
      for (const domain of Object.keys(courses)) {
        courseData = courses[domain].find(c => c.id === courseId)
        if (courseData) break
      }
      
      if (!courseData) return
      
      courseData.lessons.forEach(lesson => {
        lesson.modules.forEach(module => {
          const skillName = module.skillName
          if (!skillName) return
          
          // Find which domain this course belongs to
          const domain = Object.keys(courses).find(d => 
            courses[d].some(c => c.id === courseId)
          )
          
          if (domain) {
            const skillKey = `${domain}:${skillName}`
            discovered.add(skillKey)
          }
        })
      })
    })
    
    setDiscoveredSkills(discovered)
  }, [courseModules])

  const domains = useMemo(() => {
    return skillsData && skillsData['career domains'] 
      ? Object.keys(skillsData['career domains']) 
      : []
  }, [skillsData])

  const graphData = useMemo(() => {
    if (!skillsData || !skillsData['career domains'] || domains.length === 0) return null

    const domain = selectedDomain || domains[0]
    const domainSkills = skillsData['career domains'][domain] || {}
    const skills = Object.entries(domainSkills)
    
    if (skills.length === 0) return null
    
    // Create a hierarchical tree layout (game-like skill tree)
    const nodes = []
    const nodeMap = new Map()
    
    // Group skills by course for better organization
    const skillsByCourse = new Map()
    skills.forEach(([skillName, skillData]) => {
      skillData.courses.forEach(courseId => {
        if (!skillsByCourse.has(courseId)) {
          skillsByCourse.set(courseId, [])
        }
        skillsByCourse.get(courseId).push([skillName, skillData])
      })
    })
    
    // Create a radial/hierarchical layout
    const centerX = 600
    const centerY = 400
    const radius = 250
    const angleStep = (2 * Math.PI) / Math.max(skills.length, 8)
    
    skills.forEach(([skillName, skillData], index) => {
      const skillKey = `${domain}:${skillName}`
      const isDiscovered = discoveredSkills.has(skillKey)
      const isCompleted = completedSkills.has(skillKey)
      
      // Create a more organized layout - radial with some variation
      const angle = index * angleStep
      const distance = radius + (index % 3) * 80 // Vary distance for visual interest
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      
      const node = {
        id: skillKey,
        name: skillName,
        x: Math.max(80, Math.min(1120, x)), // Keep within bounds
        y: Math.max(80, Math.min(720, y)),
        discovered: isDiscovered,
        completed: isCompleted,
        courses: skillData.courses,
        domain,
        level: skillData.level || 1
      }
      
      nodes.push(node)
      nodeMap.set(skillKey, node)
    })

    // Create a hierarchical skill tree structure ensuring all skills are connected
    const connections = []
    const connectionMap = new Map() // Track connections to avoid duplicates
    
    // Sort nodes by discovery status and course relationships
    const sortedNodes = [...nodes].sort((a, b) => {
      // Prioritize discovered nodes
      if (a.discovered && !b.discovered) return -1
      if (!a.discovered && b.discovered) return 1
      // Then by course relationships
      const aCourses = a.courses.length
      const bCourses = b.courses.length
      return bCourses - aCourses
    })
    
    // Create a skill dependency tree - each skill connects to skills in the same course
    // and to nearby skills to ensure all are connected
    for (let i = 0; i < sortedNodes.length; i++) {
      const node1 = sortedNodes[i]
      const connectionsForNode = []
      
      // First, connect to skills in the same courses (strong connections)
      for (let j = i + 1; j < sortedNodes.length; j++) {
        const node2 = sortedNodes[j]
        const sharedCourses = node1.courses.filter(c => node2.courses.includes(c))
        
        if (sharedCourses.length > 0) {
          const connKey = `${node1.id}-${node2.id}`
          if (!connectionMap.has(connKey)) {
            connectionsForNode.push({
              from: node1.id,
              to: node2.id,
              fromNode: node1,
              toNode: node2,
              discovered: node1.discovered && node2.discovered,
              strength: 'strong'
            })
            connectionMap.set(connKey, true)
          }
        }
      }
      
      // If no strong connections, connect to nearest discovered node or first node
      if (connectionsForNode.length === 0 && i > 0) {
        // Find the nearest discovered node or the first node
        let targetNode = sortedNodes[0]
        let minDistance = Infinity
        
        for (let j = 0; j < i; j++) {
          const candidate = sortedNodes[j]
          const distance = Math.sqrt(
            Math.pow(node1.x - candidate.x, 2) + Math.pow(node1.y - candidate.y, 2)
          )
          if (distance < minDistance) {
            minDistance = distance
            targetNode = candidate
          }
        }
        
        const connKey = `${targetNode.id}-${node1.id}`
        if (!connectionMap.has(connKey)) {
          connectionsForNode.push({
            from: targetNode.id,
            to: node1.id,
            fromNode: targetNode,
            toNode: node1,
            discovered: targetNode.discovered && node1.discovered,
            strength: 'weak'
          })
          connectionMap.set(connKey, true)
        }
      }
      
      connections.push(...connectionsForNode)
    }
    
    // Ensure all nodes are connected (connect any remaining isolated nodes)
    const connectedNodeIds = new Set()
    connections.forEach(conn => {
      connectedNodeIds.add(conn.from)
      connectedNodeIds.add(conn.to)
    })
    
    // Connect any isolated nodes to the main graph
    sortedNodes.forEach(node => {
      if (!connectedNodeIds.has(node.id) && sortedNodes.length > 1) {
        // Find the closest connected node
        let closestNode = sortedNodes.find(n => connectedNodeIds.has(n.id) && n.id !== node.id)
        if (!closestNode) {
          closestNode = sortedNodes[0]
        }
        
        const connKey = `${closestNode.id}-${node.id}`
        if (!connectionMap.has(connKey)) {
          connections.push({
            from: closestNode.id,
            to: node.id,
            fromNode: closestNode,
            toNode: node,
            discovered: closestNode.discovered && node.discovered,
            strength: 'weak'
          })
          connectionMap.set(connKey, true)
          connectedNodeIds.add(node.id)
        }
      }
    })

    return { nodes, connections, domain }
  }, [skillsData, selectedDomain, discoveredSkills, completedSkills, domains])

  const handleDomainChange = useCallback((domain) => {
    setSelectedDomain(domain)
  }, [])

  const domainColors = useMemo(() => ({
    'Data Science': '#4285F4',
    'IT': '#00a86b',
    'Cybersecurity': '#d32f2f',
    'Healthcare': '#f57c00',
    'Sales': '#7b1fa2'
  }), [])

  const handleSkillClick = useCallback((node) => {
    if (!node.discovered || node.completed) return
    
    // Mark skill as completed in GameContext (saves to localStorage)
    completeSkill(node.id)
    
    // Update local state
    setCompletedSkills(prev => {
      const newSet = new Set(prev)
      newSet.add(node.id)
      return newSet
    })
    
    // Show notification
    addNotification('SKILL_UNLOCKED', {
      title: 'Skill Completed!',
      icon: '✨',
      description: `You've completed ${node.name}!`,
    })
  }, [addNotification, completeSkill])

  const color = graphData ? (domainColors[graphData.domain] || '#4285F4') : '#4285F4'
  const totalSkills = graphData ? graphData.nodes.length : 0
  const completedCount = completedSkills.size

  if (!graphData) {
    return (
      <motion.div
        className="skill-tree-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="skill-tree-header">
          <motion.button
            className="back-button"
            onClick={onBack}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </motion.button>
          <div className="skill-tree-title">
            <h1>Skill Discovery Graph</h1>
            <p>Complete courses to discover and unlock new skills</p>
          </div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Loading graph data...
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="skill-tree-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="skill-tree-header">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </motion.button>
        <div className="skill-tree-title">
          <h1>Skill Discovery Graph</h1>
          <p>Complete courses to discover and unlock new skills</p>
        </div>
        <div className="skill-tree-stats">
          <div className="stat-badge">
            <Sparkles size={18} />
            <span>{completedCount} / {totalSkills} Skills</span>
          </div>
        </div>
      </div>

      <div className="skill-tree-container">
        <div className="skill-graph-container">
          <div className="skill-graph-header">
            <div className="domain-selector">
              {domains.map(domain => (
                <button
                  key={domain}
                  className={`domain-btn ${graphData.domain === domain ? 'active' : ''}`}
                  onClick={() => handleDomainChange(domain)}
                  style={graphData.domain === domain ? { backgroundColor: color } : {}}
                >
                  {domain}
                </button>
              ))}
            </div>
            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={highlightDiscovered}
                  onChange={(e) => setHighlightDiscovered(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Highlight Undiscovered</span>
              </label>
            </div>
          </div>

          <div className="skill-graph-legend">
            <div className="legend-item">
              <div className="legend-color completed"></div>
              <span>Completed</span>
            </div>
            <div className="legend-item">
              <div className="legend-color unlocked"></div>
              <span>Discovered</span>
            </div>
            {highlightDiscovered && (
              <div className="legend-item">
                <div className="legend-color undiscovered-yellow"></div>
                <span>Undiscovered (Preview)</span>
              </div>
            )}
            {!highlightDiscovered && (
              <div className="legend-item">
                <div className="legend-color locked"></div>
                <span>Undiscovered</span>
              </div>
            )}
          </div>

          <div className="skill-graph-svg-container">
            <svg className="skill-graph-svg" viewBox="0 0 1200 800">
              {/* Render connections with game-like effects */}
              <defs>
                <linearGradient id={`connection-gradient-${graphData.domain}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {graphData.connections.map((conn, idx) => {
                  const fromNode = conn.fromNode
                  const toNode = conn.toNode
                  if (!fromNode || !toNode) return null

                  const isStrong = conn.strength === 'strong'
                  const isDiscovered = conn.discovered
                  
                  // When toggle is on, treat all connections as discovered
                  const showAsDiscovered = highlightDiscovered ? true : isDiscovered
                  
                  // Determine connection color based on toggle
                  let connectionColor = '#e0e0e0'
                  let connectionOpacity = 0.15
                  let connectionWidth = 1
                  
                  if (showAsDiscovered && highlightDiscovered) {
                    if (isDiscovered) {
                      // Real discovered connection - use domain color
                      connectionColor = isStrong ? color : `url(#connection-gradient-${graphData.domain})`
                      connectionOpacity = isStrong ? 0.8 : 0.5
                      connectionWidth = isStrong ? 3 : 2
                    } else {
                      // Undiscovered connection shown as discovered - use yellow
                      connectionColor = '#fbbf24'
                      connectionOpacity = 0.6
                      connectionWidth = 2
                    }
                  } else if (isDiscovered && !highlightDiscovered) {
                    connectionColor = '#9CA3AF'
                    connectionOpacity = 0.4
                    connectionWidth = 2
                  }

                  return (
                    <g key={`${conn.from}-${conn.to}-${idx}`}>
                      {/* Glow effect for discovered connections - only when highlighted */}
                      {showAsDiscovered && highlightDiscovered && (
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={isDiscovered ? color : '#fbbf24'}
                          strokeWidth={isStrong ? 6 : 4}
                          opacity="0.2"
                          filter="url(#glow)"
                        />
                      )}
                      {/* Main connection line */}
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={`graph-connection ${showAsDiscovered ? 'discovered' : 'undiscovered'} ${isStrong ? 'strong' : 'weak'}`}
                        stroke={connectionColor}
                        strokeWidth={connectionWidth}
                        opacity={connectionOpacity}
                        strokeDasharray={showAsDiscovered ? 'none' : '5,5'}
                      />
                    </g>
                  )
                })}

              {/* Render nodes - always show all, highlight discovered when toggle is on */}
              {graphData.nodes.map(node => {
                  const isDiscovered = node.discovered
                  const isCompleted = node.completed
                  
                  // When toggle is on, treat undiscovered as discovered (but yellow)
                  const showAsDiscovered = highlightDiscovered ? true : isDiscovered
                  
                  // Determine node color based on state and toggle
                  let nodeColor = '#fbbf24' // Yellow for undiscovered when toggle is on
                  if (isCompleted) {
                    nodeColor = '#10b981' // Completed: green
                  } else if (isDiscovered) {
                    // If highlight toggle is on, use domain color, otherwise use muted color
                    nodeColor = highlightDiscovered ? color : '#9CA3AF'
                  } else if (highlightDiscovered) {
                    // Undiscovered but toggle is on - show as yellow
                    nodeColor = '#fbbf24'
                  } else {
                    nodeColor = '#cccccc'
                  }
                  
                  const displayName = node.name.length > 20 ? node.name.substring(0, 20) + '...' : node.name
                  
                  return (
                    <g
                      key={node.id}
                      className={`skill-node-group ${isCompleted ? 'completed' : showAsDiscovered ? 'discovered' : 'undiscovered'}`}
                      onClick={() => isDiscovered && !isCompleted && handleSkillClick(node)}
                      style={{ cursor: (isDiscovered && !isCompleted) ? 'pointer' : 'default' }}
                    >
                      {/* Outer glow ring for discovered/completed skills - when highlighted or completed */}
                      {(showAsDiscovered || isCompleted) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isCompleted ? 50 : 45}
                          fill="none"
                          stroke={isCompleted ? '#10b981' : nodeColor}
                          strokeWidth="2"
                          opacity="0.3"
                          className="skill-glow-ring"
                        />
                      )}
                      
                      {/* Main skill node */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={showAsDiscovered ? 40 : 28}
                        fill={isCompleted ? '#10b981' : (showAsDiscovered ? nodeColor : '#f5f5f5')}
                        stroke={isCompleted ? '#10b981' : (showAsDiscovered ? nodeColor : '#e0e0e0')}
                        strokeWidth={isCompleted ? 4 : (showAsDiscovered ? 3 : 2)}
                        className={`skill-node ${isCompleted ? 'completed' : ''} ${showAsDiscovered ? 'discovered' : 'locked'}`}
                        filter={isCompleted ? 'url(#glow)' : 'none'}
                      />
                      
                      {/* Inner highlight for completed skills */}
                      {isCompleted && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={30}
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          opacity="0.5"
                        />
                      )}
                      
                      {/* Show text for all skills when toggle is on, or for discovered skills when toggle is off */}
                      {(showAsDiscovered || highlightDiscovered) ? (
                        <>
                          <text
                            x={node.x}
                            y={node.y - 60}
                            textAnchor="middle"
                            className="skill-name-text"
                            fill="#212529"
                            fontSize="18"
                            fontWeight="800"
                          >
                            {displayName}
                          </text>
                          {isCompleted && (
                            <text
                              x={node.x}
                              y={node.y + 6}
                              textAnchor="middle"
                              className="skill-check-text"
                              fill="#FFFFFF"
                              fontSize="26"
                              fontWeight="900"
                              stroke="#10b981"
                              strokeWidth="1.5px"
                            >
                              ✓
                            </text>
                          )}
                        </>
                      ) : (
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          className="skill-hidden-text"
                          fill="#9CA3AF"
                          fontSize="14"
                          fontWeight="600"
                        >
                          ???
                        </text>
                      )}
                    </g>
                  )
                })}
            </svg>
          </div>
        </div>

        <div className="skill-tree-legend">
          <h3>Legend</h3>
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unlocked"></div>
            <span>Discovered</span>
          </div>
          <div className="legend-item">
            <div className="legend-color locked"></div>
            <span>Undiscovered</span>
          </div>
          <div className="legend-instructions">
            <p>💡 Complete courses to discover new skills</p>
            <p>🖱️ Click on discovered skills to mark them as completed</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SkillGraph

