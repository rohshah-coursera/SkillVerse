# Coursera Gaming Dashboard

A modern, gamified learning dashboard for an ed-tech video course platform, inspired by Habitica's gamification system but styled with Coursera's clean, professional design.

## Features

- 🎮 **Gamification Elements**
  - XP (Experience Points) system
  - Level progression
  - Achievement badges
  - Learning streaks
  - Weekly goals tracking

- 📚 **Course Management**
  - Course cards with progress tracking
  - Video player integration
  - Course content navigation
  - Completion tracking

- 📊 **Dashboard**
  - Real-time stats panel
  - Progress visualization
  - Achievement showcase
  - Learning analytics

- 🎨 **Modern UI/UX**
  - Coursera-inspired blue color scheme
  - Smooth animations with Framer Motion
  - Responsive design
  - Clean, professional interface

## Tech Stack

- **React 18** - UI framework
- **Framer Motion** - Animation library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard component
│   ├── Header.jsx              # Top navigation header
│   ├── Sidebar.jsx             # Side navigation menu
│   ├── CourseCard.jsx          # Course card component
│   ├── StatsPanel.jsx          # Statistics panel
│   ├── AchievementBadge.jsx    # Achievement badge component
│   └── VideoPlayer.jsx         # Video player component
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## Key Features Explained

### Gamification System

The dashboard includes a comprehensive gamification system:

- **XP System**: Users earn experience points for completing lessons
- **Levels**: Users level up as they accumulate XP
- **Streaks**: Daily learning streaks encourage consistent engagement
- **Achievements**: Unlockable badges for various milestones
- **Weekly Goals**: Set and track weekly learning objectives

### Course Cards

Each course card displays:
- Course thumbnail and title
- Instructor information
- Progress percentage
- Video completion stats
- XP earned
- Current streak

### Video Player

The integrated video player includes:
- Full-screen video playback
- Course content sidebar
- Lesson navigation
- Progress tracking
- XP rewards for completion

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`. The primary Coursera blue is defined as `coursera-blue-500` (#0056D2).

### Adding New Features

Components are modular and can be easily extended:
- Add new stats to `StatsPanel.jsx`
- Create new achievement types in `AchievementBadge.jsx`
- Extend course data structure in `Dashboard.jsx`

## License

This project is created for educational purposes.

## Acknowledgments

- Inspired by Habitica's gamification system
- UI design inspired by Coursera's clean interface
- Built with modern React and animation best practices

