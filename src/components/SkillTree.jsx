import React, { useState, useRef, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'
import './SkillTree.css'

// Lazy load Three.js components
let Canvas, useFrame, OrbitControls, Html, THREE

// AI Domain Skills Structure
const AI_SKILLS_TREE = {
  root: {
    id: 'ai-foundations',
    name: 'AI Foundations',
    position: [0, 0, 0],
    prerequisites: [],
    domain: 'AI',
  },
  branches: [
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      position: [-3, 2, 0],
      prerequisites: ['ai-foundations'],
      domain: 'AI',
      skills: [
        { id: 'supervised-learning', name: 'Supervised Learning', position: [-4, 3.5, 0], completed: false },
        { id: 'unsupervised-learning', name: 'Unsupervised Learning', position: [-2, 3.5, 0], completed: false },
        { id: 'reinforcement-learning', name: 'Reinforcement Learning', position: [-3, 4.5, 0], completed: false },
      ],
    },
    {
      id: 'deep-learning',
      name: 'Deep Learning',
      position: [0, 2, 0],
      prerequisites: ['machine-learning'],
      domain: 'AI',
      skills: [
        { id: 'neural-networks', name: 'Neural Networks', position: [-1, 3.5, 0], completed: false },
        { id: 'cnn', name: 'CNN', position: [0, 3.5, 0], completed: false },
        { id: 'rnn', name: 'RNN', position: [1, 3.5, 0], completed: false },
        { id: 'transformers', name: 'Transformers', position: [0, 4.5, 0], completed: false },
      ],
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      position: [3, 2, 0],
      prerequisites: ['deep-learning'],
      domain: 'AI',
      skills: [
        { id: 'text-processing', name: 'Text Processing', position: [2, 3.5, 0], completed: false },
        { id: 'sentiment-analysis', name: 'Sentiment Analysis', position: [3, 3.5, 0], completed: false },
        { id: 'language-models', name: 'Language Models', position: [4, 3.5, 0], completed: false },
        { id: 'chatbots', name: 'Chatbots', position: [3, 4.5, 0], completed: false },
      ],
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision',
      position: [-1.5, 2, 0],
      prerequisites: ['deep-learning'],
      domain: 'AI',
      skills: [
        { id: 'image-classification', name: 'Image Classification', position: [-2, 3.5, 0], completed: false },
        { id: 'object-detection', name: 'Object Detection', position: [-1, 3.5, 0], completed: false },
        { id: 'image-segmentation', name: 'Image Segmentation', position: [-1.5, 4.5, 0], completed: false },
      ],
    },
    {
      id: 'ai-ethics',
      name: 'AI Ethics',
      position: [1.5, 2, 0],
      prerequisites: ['ai-foundations'],
      domain: 'AI',
      skills: [
        { id: 'bias-detection', name: 'Bias Detection', position: [1, 3.5, 0], completed: false },
        { id: 'fairness', name: 'Fairness', position: [2, 3.5, 0], completed: false },
        { id: 'privacy', name: 'Privacy', position: [1.5, 4.5, 0], completed: false },
      ],
    },
  ],
}

// Branch component (3D cylinder)
function Branch({ start, end, completed }) {
  const meshRef = useRef()
  
  if (!THREE) return null
  
  const startVec = new THREE.Vector3(...start)
  const endVec = new THREE.Vector3(...end)
  const direction = new THREE.Vector3().subVectors(endVec, startVec)
  const length = direction.length()
  const center = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.atan2(direction.y, direction.x) - Math.PI / 2
    }
  })

  return (
    <mesh ref={meshRef} position={center}>
      <cylinderGeometry args={[0.05, 0.05, length, 8]} />
      <meshStandardMaterial 
        color={completed ? '#10b981' : '#6b7280'} 
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  )
}

// Skill Leaf component (3D sphere with text)
function SkillLeaf({ skill, position, completed, unlocked, onComplete }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  if (!useFrame || !Html) return null

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      if (hovered && unlocked) {
        const baseY = position[1]
        meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2) * 0.1
      } else {
        meshRef.current.position.y = position[1]
      }
    }
  })

  const handleClick = () => {
    if (unlocked && !completed) {
      onComplete(skill.id)
    }
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered && unlocked ? 1.2 : 1}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={completed ? '#10b981' : unlocked ? '#3b82f6' : '#9ca3af'}
          emissive={completed ? '#10b981' : unlocked ? '#3b82f6' : '#000000'}
          emissiveIntensity={completed ? 0.5 : unlocked ? 0.2 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 0.6, 0]}>
        <div className={`skill-label ${completed ? 'completed' : unlocked ? 'unlocked' : 'locked'}`}>
          {skill.name}
          {completed && <span className="check-mark">✓</span>}
        </div>
      </Html>
    </group>
  )
}

// Branch Node component
function BranchNode({ branch, position, completed, unlocked, onComplete, skills }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  if (!useFrame || !Html) return null

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
        <meshStandardMaterial
          color={completed ? '#10b981' : unlocked ? '#3b82f6' : '#6b7280'}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 0.8, 0]}>
        <div className={`branch-label ${completed ? 'completed' : unlocked ? 'unlocked' : 'locked'}`}>
          {branch.name}
        </div>
      </Html>
      {skills.map((skill) => (
        <SkillLeaf
          key={skill.id}
          skill={skill}
          position={skill.position}
          completed={skill.completed}
          unlocked={unlocked && branch.completed}
          onComplete={onComplete}
        />
      ))}
    </group>
  )
}

// Root Node component
function RootNode({ root, position, completed }) {
  const meshRef = useRef()

  if (!useFrame || !Html) return null

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={completed ? '#10b981' : '#0056D2'}
          emissive={completed ? '#10b981' : '#0056D2'}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 0.8, 0]}>
        <div className={`root-label ${completed ? 'completed' : ''}`}>
          {root.name}
        </div>
      </Html>
    </group>
  )
}

// Main 3D Scene
function SkillTreeScene({ skillsTree, completedSkills, unlockedSkills, onCompleteSkill }) {
  const { branches, root } = skillsTree

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Root Node */}
      <RootNode root={root} position={root.position} completed={completedSkills.has(root.id)} />

      {/* Branches and Skills */}
      {branches.map((branch) => {
        const branchUnlocked = branch.prerequisites.every(prereq => completedSkills.has(prereq))
        const branchCompleted = branch.skills.every(skill => completedSkills.has(skill.id))
        
        return (
          <group key={branch.id}>
            {/* Branch connection from root */}
            <Branch
              start={root.position}
              end={branch.position}
              completed={branchCompleted}
            />
            
            {/* Branch Node */}
            <BranchNode
              branch={branch}
              position={branch.position}
              completed={branchCompleted}
              unlocked={branchUnlocked}
              onComplete={onCompleteSkill}
              skills={branch.skills.map(skill => ({
                ...skill,
                completed: completedSkills.has(skill.id),
              }))}
            />

            {/* Skill connections from branch */}
            {branch.skills.map((skill) => (
              <Branch
                key={`${branch.id}-${skill.id}`}
                start={branch.position}
                end={skill.position}
                completed={completedSkills.has(skill.id)}
              />
            ))}
          </group>
        )
      })}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />
    </>
  )
}

const SkillTree = ({ onBack }) => {
  const { skills, level, addNotification } = useGame()
  const [completedSkills, setCompletedSkills] = useState(new Set())
  const [unlockedSkills, setUnlockedSkills] = useState(new Set(['ai-foundations']))
  const [threeJsLoaded, setThreeJsLoaded] = useState(false)

  // Dynamically load Three.js packages
  useEffect(() => {
    const loadThreeJs = async () => {
      try {
        const [fiber, drei, three] = await Promise.all([
          import('@react-three/fiber'),
          import('@react-three/drei'),
          import('three')
        ])
        Canvas = fiber.Canvas
        useFrame = fiber.useFrame
        OrbitControls = drei.OrbitControls
        Html = drei.Html
        THREE = three
        setThreeJsLoaded(true)
      } catch (e) {
        console.warn('Three.js packages not installed. Please run: npm install three @react-three/fiber @react-three/drei')
        setThreeJsLoaded(false)
      }
    }
    loadThreeJs()
  }, [])

  // Check if Three.js is available
  if (!threeJsLoaded || !Canvas || !THREE) {
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
        </div>
        <div className="skill-tree-error">
          <AlertCircle size={48} />
          <h2>Three.js Packages Not Installed</h2>
          <p>To use the 3D Skill Tree, please install the required packages:</p>
          <div className="install-instructions">
            <code>npm install three @react-three/fiber @react-three/drei</code>
          </div>
          <p className="install-note">After installation, restart your dev server.</p>
        </div>
      </motion.div>
    )
  }

  // Initialize completed skills from game context
  React.useEffect(() => {
    const completed = new Set(['ai-foundations']) // Root is always completed
    const unlocked = new Set(['ai-foundations'])
    
    // Check which skills are completed based on level and existing skills
    AI_SKILLS_TREE.branches.forEach((branch) => {
      const branchUnlocked = branch.prerequisites.every(prereq => completed.has(prereq))
      if (branchUnlocked) {
        unlocked.add(branch.id)
        branch.skills.forEach(skill => {
          unlocked.add(skill.id)
          // Mark as completed if level is high enough (demo logic)
          if (level >= 5 && skill.id.includes('supervised')) completed.add(skill.id)
          if (level >= 8 && skill.id.includes('neural')) completed.add(skill.id)
        })
      }
    })

    setCompletedSkills(completed)
    setUnlockedSkills(unlocked)
  }, [level, skills])

  const handleCompleteSkill = React.useCallback((skillId) => {
    if (!unlockedSkills.has(skillId) || completedSkills.has(skillId)) return

    setCompletedSkills(prev => {
      const newCompleted = new Set([...prev, skillId])
      
      // Check if branch is now complete
      const branch = AI_SKILLS_TREE.branches.find(b => 
        b.skills.some(s => s.id === skillId)
      )
      
      if (branch) {
        const allSkillsComplete = branch.skills.every(s => 
          s.id === skillId || prev.has(s.id)
        )
        
        if (allSkillsComplete) {
          newCompleted.add(branch.id)
          setTimeout(() => {
            addNotification('SKILL_UNLOCKED', {
              title: `${branch.name} Branch Completed!`,
              icon: '🌳',
              description: 'You\'ve mastered this branch!',
            })
          }, 300)
        }
      }

      setTimeout(() => {
        addNotification('SKILL_UNLOCKED', {
          title: 'Skill Completed!',
          icon: '✨',
          description: `You've completed a skill in the AI domain!`,
        })
      }, 100)

      return newCompleted
    })
  }, [unlockedSkills, completedSkills, addNotification])

  const totalSkills = AI_SKILLS_TREE.branches.reduce((sum, branch) => sum + branch.skills.length, 0)
  const completedCount = completedSkills.size - 1 // Exclude root

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
          <h1>AI Skill Tree</h1>
          <p>Complete skills to unlock new branches and advance your AI knowledge</p>
        </div>
        <div className="skill-tree-stats">
          <div className="stat-badge">
            <Sparkles size={18} />
            <span>{completedCount} / {totalSkills} Skills</span>
          </div>
        </div>
      </div>

      <div className="skill-tree-container">
        <div className="skill-tree-canvas">
          <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <SkillTreeScene
                skillsTree={AI_SKILLS_TREE}
                completedSkills={completedSkills}
                unlockedSkills={unlockedSkills}
                onCompleteSkill={handleCompleteSkill}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="skill-tree-legend">
          <h3>Legend</h3>
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color unlocked"></div>
            <span>Unlocked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color locked"></div>
            <span>Locked</span>
          </div>
          <div className="legend-instructions">
            <p>💡 Click on unlocked skills to complete them</p>
            <p>🖱️ Drag to rotate, scroll to zoom</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SkillTree

