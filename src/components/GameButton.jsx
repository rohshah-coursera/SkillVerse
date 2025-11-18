import React from 'react'
import { motion } from 'framer-motion'
import { soundManager } from '../libs/soundManager'
import './GameButton.css'

const GameButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleClick = (e) => {
    if (!disabled) {
      soundManager.playClick()
      onClick?.(e)
    }
  }

  const handleHover = () => {
    if (!disabled) {
      soundManager.playHover()
    }
  }

  return (
    <motion.button
      className={`game-button game-button-${variant} game-button-${size} ${className}`}
      onClick={handleClick}
      onMouseEnter={handleHover}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
      {...props}
    >
      <span className="game-button-content">{children}</span>
      <span className="game-button-shine" />
    </motion.button>
  )
}

export default GameButton

