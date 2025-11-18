import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ParticleEffect = ({ type = 'sparkle', count = 20, duration = 1 }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particles = []

    const colors = {
      sparkle: ['#fbbf24', '#f59e0b', '#fcd34d'],
      xp: ['#3b82f6', '#8b5cf6', '#a855f7'],
      badge: ['#a855f7', '#ec4899', '#f472b6'],
      level: ['#10b981', '#34d399', '#6ee7b7'],
      streak: ['#f97316', '#fb923c', '#fdba74'],
    }

    const particleColors = colors[type] || colors.sparkle

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.style.position = 'absolute'
      particle.style.width = '6px'
      particle.style.height = '6px'
      particle.style.borderRadius = '50%'
      particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)]
      particle.style.pointerEvents = 'none'
      particle.style.boxShadow = `0 0 8px ${particleColors[Math.floor(Math.random() * particleColors.length)]}`
      
      const angle = (Math.PI * 2 * i) / count
      const distance = 50 + Math.random() * 50
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      particle.style.left = '50%'
      particle.style.top = '50%'
      particle.style.transform = 'translate(-50%, -50%)'

      container.appendChild(particle)

      const animation = particle.animate(
        [
          {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: duration * 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }
      )

      animation.onfinish = () => {
        particle.remove()
      }

      particles.push({ element: particle, animation })
    }

    return () => {
      particles.forEach(({ element, animation }) => {
        animation.cancel()
        element.remove()
      })
    }
  }, [type, count, duration])

  return (
    <div
      ref={containerRef}
      className="particle-container"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100px',
        height: '100px',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  )
}

export default ParticleEffect

