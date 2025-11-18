// Sound Manager for game-like audio feedback
class SoundManager {
  constructor() {
    this.audioContext = null
    this.sounds = {}
    this.enabled = true
    this.volume = 0.5
    
    // Initialize Web Audio API
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  // Generate sound using Web Audio API (game-like beeps)
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * this.volume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Play notification sound
  playNotification(type) {
    if (!this.enabled) return

    switch (type) {
      case 'VIDEO_COMPLETED':
        // Success chime
        this.playTone(523.25, 0.1, 'sine', 0.3) // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 50) // E5
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.3), 100) // G5
        break

      case 'BADGE_UNLOCKED':
        // Achievement fanfare
        this.playTone(523.25, 0.15, 'sine', 0.4) // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.4), 100) // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.4), 200) // G5
        setTimeout(() => this.playTone(1046.50, 0.3, 'sine', 0.5), 300) // C6
        break

      case 'LEVEL_UP':
        // Level up sound
        this.playTone(392.00, 0.1, 'sine', 0.3) // G4
        setTimeout(() => this.playTone(523.25, 0.1, 'sine', 0.3), 80) // C5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 160) // E5
        setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.4), 240) // G5
        setTimeout(() => this.playTone(1046.50, 0.3, 'sine', 0.5), 320) // C6
        break

      case 'STREAK_ACHIEVEMENT':
        // Streak celebration
        this.playTone(440.00, 0.1, 'sine', 0.3) // A4
        setTimeout(() => this.playTone(554.37, 0.1, 'sine', 0.3), 50) // C#5
        setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.3), 100) // E5
        setTimeout(() => this.playTone(880.00, 0.2, 'sine', 0.4), 150) // A5
        break

      case 'COURSE_COMPLETED':
        // Victory fanfare
        this.playTone(523.25, 0.15, 'sine', 0.4) // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.4), 100) // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.4), 200) // G5
        setTimeout(() => this.playTone(987.77, 0.15, 'sine', 0.4), 300) // B5
        setTimeout(() => this.playTone(1174.66, 0.3, 'sine', 0.5), 400) // D6
        break

      case 'SKILL_UNLOCKED':
        // Skill unlock
        this.playTone(659.25, 0.1, 'sine', 0.3) // E5
        setTimeout(() => this.playTone(783.99, 0.1, 'sine', 0.3), 80) // G5
        setTimeout(() => this.playTone(1046.50, 0.2, 'sine', 0.4), 160) // C6
        break

      case 'TASK_COMPLETE':
        // Quick completion sound
        this.playTone(659.25, 0.08, 'sine', 0.25) // E5
        setTimeout(() => this.playTone(783.99, 0.12, 'sine', 0.3), 60) // G5
        break

      case 'MODULE_COMPLETED':
        // Module completion fanfare (mega XP)
        this.playTone(523.25, 0.15, 'sine', 0.4) // C5
        setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.4), 100) // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.4), 200) // G5
        setTimeout(() => this.playTone(1046.50, 0.3, 'sine', 0.5), 300) // C6
        break

      default:
        // Default notification
        this.playTone(523.25, 0.1, 'sine', 0.3)
    }
  }

  // Play hover sound
  playHover() {
    if (!this.enabled) return
    this.playTone(440.00, 0.05, 'sine', 0.15)
  }

  // Play click sound
  playClick() {
    if (!this.enabled) return
    this.playTone(523.25, 0.05, 'sine', 0.2)
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }
}

// Export singleton instance
export const soundManager = new SoundManager()

