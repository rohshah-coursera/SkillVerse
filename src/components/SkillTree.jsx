import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { ArrowLeft, Sparkles } from 'lucide-react'
import * as THREE from 'three'
import './SkillTree.css'

// AI Domain Skills Structure (Upside-down tree: roots at top, branches/leaves at bottom)
const AI_SKILLS_TREE = {
  root: {
    id: 'ai-foundations',
    name: 'AI Foundations',
    position: [0, 4, 0], // Top (roots)
    prerequisites: [],
    domain: 'AI',
  },
  trunkHeight: 3, // Height of main trunk
  branches: [
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      position: [-2.5, 1, 0], // Middle section (main branches)
      prerequisites: ['ai-foundations'],
      domain: 'AI',
      skills: [
        { id: 'supervised-learning', name: 'Supervised Learning', position: [-3.5, -1.5, 0], completed: false },
        { id: 'unsupervised-learning', name: 'Unsupervised Learning', position: [-1.5, -1.5, 0], completed: false },
        { id: 'reinforcement-learning', name: 'Reinforcement Learning', position: [-2.5, -2.5, 0], completed: false },
      ],
    },
    {
      id: 'deep-learning',
      name: 'Deep Learning',
      position: [0, 1, 0],
      prerequisites: ['machine-learning'],
      domain: 'AI',
      skills: [
        { id: 'neural-networks', name: 'Neural Networks', position: [-1, -1.5, 0], completed: false },
        { id: 'cnn', name: 'CNN', position: [0, -1.5, 0], completed: false },
        { id: 'rnn', name: 'RNN', position: [1, -1.5, 0], completed: false },
        { id: 'transformers', name: 'Transformers', position: [0, -2.5, 0], completed: false },
      ],
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      position: [2.5, 1, 0],
      prerequisites: ['deep-learning'],
      domain: 'AI',
      skills: [
        { id: 'text-processing', name: 'Text Processing', position: [1.5, -1.5, 0], completed: false },
        { id: 'sentiment-analysis', name: 'Sentiment Analysis', position: [2.5, -1.5, 0], completed: false },
        { id: 'language-models', name: 'Language Models', position: [3.5, -1.5, 0], completed: false },
        { id: 'chatbots', name: 'Chatbots', position: [2.5, -2.5, 0], completed: false },
      ],
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision',
      position: [-1.2, 1, 0],
      prerequisites: ['deep-learning'],
      domain: 'AI',
      skills: [
        { id: 'image-classification', name: 'Image Classification', position: [-1.8, -1.5, 0], completed: false },
        { id: 'object-detection', name: 'Object Detection', position: [-0.6, -1.5, 0], completed: false },
        { id: 'image-segmentation', name: 'Image Segmentation', position: [-1.2, -2.5, 0], completed: false },
      ],
    },
    {
      id: 'ai-ethics',
      name: 'AI Ethics',
      position: [1.2, 1, 0],
      prerequisites: ['ai-foundations'],
      domain: 'AI',
      skills: [
        { id: 'bias-detection', name: 'Bias Detection', position: [0.6, -1.5, 0], completed: false },
        { id: 'fairness', name: 'Fairness', position: [1.8, -1.5, 0], completed: false },
        { id: 'privacy', name: 'Privacy', position: [1.2, -2.5, 0], completed: false },
      ],
    },
  ],
}

// Tree Trunk component (main vertical trunk)
function TreeTrunk({ start, end }) {
  const startVec = new THREE.Vector3(...start)
  const endVec = new THREE.Vector3(...end)
  const direction = new THREE.Vector3().subVectors(endVec, startVec)
  const length = direction.length()
  const center = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
  
  // Calculate rotation to align with direction
  const angle = Math.atan2(direction.y, direction.x) - Math.PI / 2
  
  return (
    <mesh position={center} rotation={[0, 0, angle]}>
      <cylinderGeometry args={[0.15, 0.2, length, 12]} />
      <meshStandardMaterial 
        color="#8B4513" // Brown wood color
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}

// Branch component (tree branch - brown cylinder)
function Branch({ start, end, completed }) {
  const meshRef = useRef()
  
  const startVec = new THREE.Vector3(...start)
  const endVec = new THREE.Vector3(...end)
  const direction = new THREE.Vector3().subVectors(endVec, startVec)
  const length = direction.length()
  const center = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
  
  // Calculate rotation to align with direction
  const angle = Math.atan2(direction.y, direction.x) - Math.PI / 2
  
  // Thickness varies: thicker at start, thinner at end
  const startRadius = completed ? 0.08 : 0.06
  const endRadius = completed ? 0.05 : 0.04

  return (
    <mesh ref={meshRef} position={center} rotation={[0, 0, angle]}>
      <cylinderGeometry args={[startRadius, endRadius, length, 8]} />
      <meshStandardMaterial 
        color={completed ? "#6B8E23" : "#8B4513"} // Olive green if completed, brown if not
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}

// Skill Leaf component (leaf-shaped geometry)
function SkillLeaf({ skill, position, completed, unlocked, onComplete }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion like a leaf in the wind
      const sway = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.rotation.z = sway
      
      if (hovered && unlocked) {
        const baseY = position[1]
        groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 2) * 0.15
        groupRef.current.rotation.y += 0.02
      } else {
        groupRef.current.position.y = position[1]
      }
    }
  })

  const handleClick = () => {
    if (unlocked && !completed) {
      onComplete(skill.id)
    }
  }

  // Create leaf shape using a flattened sphere
  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered && unlocked ? [1.3, 1.3, 0.8] : [1, 1, 0.6]}
        rotation={[Math.PI / 4, 0, 0]}
      >
        <sphereGeometry args={[0.25, 12, 8]} />
        <meshStandardMaterial
          color={completed ? '#228B22' : unlocked ? '#32CD32' : '#8B7355'} // Green if completed/unlocked, brown if locked
          emissive={completed ? '#228B22' : unlocked ? '#32CD32' : '#000000'}
          emissiveIntensity={completed ? 0.3 : unlocked ? 0.15 : 0}
          roughness={0.7}
          metalness={0.1}
          transparent={!unlocked}
          opacity={unlocked ? 1 : 0.5}
        />
      </mesh>
      {/* Add a small stem */}
      <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <Html distanceFactor={10} position={[0, -0.5, 0]}>
        <div className={`skill-label ${completed ? 'completed' : unlocked ? 'unlocked' : 'locked'}`}>
          {skill.name}
          {completed && <span className="check-mark">✓</span>}
        </div>
      </Html>
    </group>
  )
}

// Branch Node component (thicker branch junction)
function BranchNode({ branch, position, completed, unlocked, onComplete, skills }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.3, 10]} />
        <meshStandardMaterial
          color={completed ? "#6B8E23" : unlocked ? "#8B4513" : "#654321"} // Olive green if completed, brown if unlocked, darker brown if locked
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 0.5, 0]}>
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
          unlocked={unlocked}
          onComplete={onComplete}
        />
      ))}
    </group>
  )
}

// Root Node component (tree roots at the top)
function RootNode({ root, position, completed }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  // Create multiple root strands
  const rootPositions = [
    [0, 0, 0],
    [-0.3, 0.2, 0],
    [0.3, 0.2, 0],
    [-0.15, 0.3, 0],
    [0.15, 0.3, 0],
  ]

  return (
    <group position={position}>
      {/* Main root center */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={completed ? "#654321" : "#4A4A4A"}
          emissive={completed ? "#654321" : "#000000"}
          emissiveIntensity={completed ? 0.2 : 0}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Root strands */}
      {rootPositions.map((pos, idx) => (
        <mesh key={idx} position={pos} rotation={[0, 0, Math.PI / 4 + idx * 0.3]}>
          <cylinderGeometry args={[0.08, 0.05, 0.4, 6]} />
          <meshStandardMaterial
            color={completed ? "#654321" : "#4A4A4A"}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
      
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
  const { branches, root, trunkHeight } = skillsTree
  
  // Calculate trunk end position (from root down)
  const trunkEnd = [root.position[0], root.position[1] - trunkHeight, root.position[2]]

  return (
    <>
      {/* Lighting - natural tree lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#FFE5B4" />
      <directionalLight position={[-5, 8, -5]} intensity={0.5} color="#E6F3FF" />
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#FFFACD" />

      {/* Ground plane (optional - for visual reference) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2D5016" roughness={0.9} />
      </mesh>

      {/* Root Node (at the top) */}
      <RootNode root={root} position={root.position} completed={completedSkills.has(root.id)} />

      {/* Main Trunk (from root down to branch level) */}
      <TreeTrunk start={root.position} end={trunkEnd} />

      {/* Branches and Skills */}
      {branches.map((branch) => {
        const branchUnlocked = branch.prerequisites.every(prereq => completedSkills.has(prereq))
        const branchCompleted = branch.skills.every(skill => completedSkills.has(skill.id))
        
        return (
          <group key={branch.id}>
            {/* Branch connection from trunk to branch node */}
            <Branch
              start={trunkEnd}
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

            {/* Skill connections from branch to leaves */}
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
        minDistance={8}
        maxDistance={25}
        target={[0, 0, 0]} // Center on tree
      />
    </>
  )
}

const SkillTree = ({ onBack }) => {
  const { skills, level, addNotification } = useGame()
  const [completedSkills, setCompletedSkills] = useState(new Set())
  const [unlockedSkills, setUnlockedSkills] = useState(new Set(['ai-foundations']))

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
          <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
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

