# Career Skills Tree - Gamification Platform

A React-based skill tracking application with a beautiful skill tree visualization, inspired by Coursera's design guidelines.

## Features

- **Skill Tree Visualization**: Interactive tree structure showing career domains as branches and skills as nodes
- **Progress Tracking**: Checkbox system to mark skills as completed
- **Hover Tooltips**: View popularity and relevance ratings when hovering over skills
- **Progress Indicators**: Visual progress bars for each career domain
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Coursera-Inspired UI**: Clean, modern design following Coursera's design principles

## Tech Stack

- React 18
- Vite (build tool)
- CSS3 (custom styling)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
gamification/
├── public/
│   └── career_domains_skills.json  # Skills data
├── src/
│   ├── components/
│   │   ├── SkillTree.jsx           # Main tree container
│   │   ├── DomainBranch.jsx        # Career domain branch
│   │   ├── SkillNode.jsx           # Individual skill node
│   │   └── *.css                   # Component styles
│   ├── App.jsx                      # Main app component
│   ├── App.css                      # App styles
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Usage

1. **View Career Domains**: Click on any career domain header to expand/collapse the skill list
2. **Track Progress**: Click the checkbox next to any skill to mark it as completed
3. **View Details**: Hover over any skill to see its popularity and relevance ratings
4. **Monitor Progress**: Each domain shows a progress bar indicating completion percentage

## Career Domains

The application includes 5 career domains:
- Data Science
- IT
- Cybersecurity
- Healthcare
- Sales

Each domain contains approximately 100 skills with popularity and relevance ratings.

## Design Philosophy

The UI follows Coursera's design guidelines:
- Clean, minimalist interface
- Clear typography (Source Sans Pro)
- Consistent color scheme with domain-specific accents
- Smooth animations and transitions
- Accessible and user-friendly interactions

