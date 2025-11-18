import React from 'react'
import { motion } from 'framer-motion'
import { GameProvider } from './context/GameContext'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import NotificationSystem from './components/NotificationSystem'
import NotificationPanel from './components/NotificationPanel'
import './App.css'

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <Header />
        <div className="app-content">
          <motion.main
            className="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard />
          </motion.main>
        </div>
        <NotificationSystem />
        <NotificationPanel />
      </div>
    </GameProvider>
  )
}

export default App

