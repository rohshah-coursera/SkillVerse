import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import './SkillGraph.css'

function SkillGraph({ skillsData, discoveredSkills = {}, skillLevels = {}, onSkillClick }) {
  const [selectedDomain, setSelectedDomain] = useState(null)

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
    
    // Calculate grid layout once
    const cols = Math.ceil(Math.sqrt(skills.length))
    
    // Create node map for O(1) lookup
    const nodeMap = new Map()
    const nodes = skills.map(([skillName, skillData], index) => {
      const skillKey = `${domain}:${skillName}`
      const isDiscovered = discoveredSkills?.[skillKey] || false
      const level = skillLevels?.[skillKey] || 0
      
      const row = Math.floor(index / cols)
      const col = index % cols
      
      const node = {
        id: skillKey,
        name: skillName,
        x: col * 200 + 100,
        y: row * 150 + 100,
        discovered: isDiscovered,
        level: level,
        popularity: skillData.popularity,
        relevance: skillData.relevance,
        completed: skillData.completed || false
      }
      
      nodeMap.set(skillKey, node)
      return node
    })

    // Optimize connections - limit to reasonable number and only connect nearby nodes
    const connections = []
    const maxConnections = Math.min(50, Math.floor(nodes.length * 2)) // Limit connections for performance
    
    // Only check nearby nodes to reduce computation
    for (let i = 0; i < nodes.length && connections.length < maxConnections; i++) {
      const node1 = nodes[i]
      // Only check nodes within a reasonable distance
      const nearbyNodes = nodes.slice(i + 1).filter(node2 => {
        const distance = Math.sqrt(
          Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
        )
        return distance < 300 // Only check nodes within 300px
      })
      
      for (const node2 of nearbyNodes) {
        if (connections.length >= maxConnections) break
        
        // Only connect if very similar ratings or very close
        const ratingDiff = Math.abs(node1.popularity - node2.popularity) + 
                          Math.abs(node1.relevance - node2.relevance)
        const distance = Math.sqrt(
          Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
        )
        
        if (ratingDiff <= 2 || distance < 200) {
          connections.push({
            from: node1.id,
            to: node2.id,
            fromNode: node1,
            toNode: node2,
            discovered: node1.discovered && node2.discovered
          })
        }
      }
    }

    return { nodes, connections, domain, nodeMap }
  }, [skillsData, selectedDomain, discoveredSkills, skillLevels, domains])

  const handleDomainChange = useCallback((domain) => {
    setSelectedDomain(domain)
  }, [])

  const domainColors = useMemo(() => ({
    'Data Science': '#0056d2',
    'IT': '#00a86b',
    'Cybersecurity': '#d32f2f',
    'Healthcare': '#f57c00',
    'Sales': '#7b1fa2'
  }), [])

  const color = graphData ? (domainColors[graphData.domain] || '#0056d2') : '#0056d2'

  if (!graphData) {
    return (
      <div className="skill-graph-container">
        <div className="skill-graph-header">
          <h2>Skill Discovery Graph</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Loading graph data...
        </div>
      </div>
    )
  }

  return (
    <div className="skill-graph-container">
      <div className="skill-graph-header">
        <h2>Skill Discovery Graph</h2>
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
      </div>

      <div className="skill-graph-legend">
        <div className="legend-item">
          <div className="legend-node discovered"></div>
          <span>Discovered</span>
        </div>
        <div className="legend-item">
          <div className="legend-node undiscovered"></div>
          <span>Undiscovered</span>
        </div>
      </div>

      <div className="skill-graph-svg-container">
        <svg className="skill-graph-svg" viewBox="0 0 1200 800">
          {/* Render connections - use pre-computed nodes */}
          {graphData.connections.map((conn, idx) => {
            const fromNode = conn.fromNode
            const toNode = conn.toNode
            if (!fromNode || !toNode) return null

            return (
              <line
                key={`${conn.from}-${conn.to}-${idx}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={`graph-connection ${conn.discovered ? 'discovered' : 'undiscovered'}`}
                stroke={conn.discovered ? color : '#e0e0e0'}
                strokeWidth={conn.discovered ? 2 : 1}
                opacity={conn.discovered ? 0.6 : 0.2}
              />
            )
          })}

          {/* Render nodes - only show discovered or first 20 for performance */}
          {graphData.nodes
            .filter((node, idx) => node.discovered || idx < 20)
            .map(node => {
              const isDiscovered = node.discovered
              const nodeColor = isDiscovered ? color : '#cccccc'
              const displayName = node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name
              
              return (
                <g
                  key={node.id}
                  className={`skill-node-group ${isDiscovered ? 'discovered' : 'undiscovered'}`}
                  onClick={() => isDiscovered && onSkillClick && onSkillClick(node)}
                  style={{ cursor: isDiscovered ? 'pointer' : 'default' }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isDiscovered ? 35 : 25}
                    fill={isDiscovered ? nodeColor : '#f5f5f5'}
                    stroke={isDiscovered ? nodeColor : '#e0e0e0'}
                    strokeWidth={isDiscovered ? 3 : 2}
                    className={node.completed ? 'completed' : ''}
                  />
                  {isDiscovered ? (
                    <>
                      <text
                        x={node.x}
                        y={node.y - 50}
                        textAnchor="middle"
                        className="skill-name-text"
                        fill={nodeColor}
                        fontSize="12"
                        fontWeight="600"
                      >
                        {displayName}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className="skill-level-text"
                        fill="white"
                        fontSize="14"
                        fontWeight="700"
                      >
                        Lv.{node.level}
                      </text>
                    </>
                  ) : (
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      className="skill-hidden-text"
                      fill="#999"
                      fontSize="10"
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
  )
}

export default memo(SkillGraph)

