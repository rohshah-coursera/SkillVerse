# SkillVerse - Coursera AI Spark Day Submission

Hey! This is our submission for **Coursera's AI Spark Day** from team **SkillVerse**. Our topic was **Verified Skills & Gamification**.

## What We Built

We wanted to make learning feel more like a journey where you can actually see your skills growing. So we built a platform that connects everything you learn to real, verifiable skills - and made it fun with some gamification magic.

### The Core Idea

The challenge was to prototype an integrated skills-based experience that includes:
- Skills assessment and mapping
- Industry/enterprise skills integration  
- Learner skill profiles
- Skills graph visualization
- Gamified progression

We thought: what if every course module you complete actually unlocks a specific skill? And what if you could see all those skills connected in a visual graph, like a skill tree in a game? That's basically what we built.

## What We Actually Did

### 1. **Skills Mapping** 🗺️
We mapped every course module to a specific skill. So when you complete "Introduction to Python", you're not just completing a module - you're earning the "Python" skill. Same for "Pandas", "Machine Learning", "AWS", etc. Each course is organized by career domains (Data Science, IT, Cybersecurity, Healthcare, Sales).

### 2. **Skill Discovery Graph** 🌐
This was probably the coolest part. We built an interactive graph that shows all the skills you can learn, organized by domain. Skills start as "undiscovered" (grayed out with ???) until you complete courses that teach them. Once you complete a course, those skills become "discovered" and you can see them in the graph. Complete them, and they turn green. It's like exploring a skill map!

The graph shows connections between skills - skills that are taught in the same course are connected, so you can see how different skills relate to each other. We also added a toggle to preview all undiscovered skills (in yellow) so you can see what's possible.

### 3. **3D Skill Tree** 🌳
We got a bit carried away here and built a 3D interactive skill tree using Three.js. It's like a tree where skills are leaves, branches are skill categories, and the roots are foundational concepts. You can rotate it, zoom in, and click on skills to complete them. It's more of a "stretch idea" but we thought it was fun.

### 4. **Gamified Progression** 🎮
We added all the classic gamification stuff:
- **XP System**: Earn XP for completing videos and modules
- **Leveling Up**: Level up as you gain XP, with progress bars and notifications
- **Achievement Badges**: Unlock badges for milestones like "First Steps", "Week Warrior" (7-day streak), "Course Master", etc.
- **Learning Streaks**: Track daily learning streaks with visual feedback
- **Skill Profiles**: Your profile shows all your completed skills, organized by domain

### 5. **Engagement Loops** 🔄
We added daily goals, streak tracking, and notification popups that celebrate your achievements. Every time you level up, complete a skill, or hit a streak milestone, you get a nice popup notification. It's the little things that keep you coming back.

### 6. **Learner Profile** 👤
Your profile shows:
- Your current level and XP
- All completed skills (organized by domain)
- Achievement badges you've unlocked
- Your current streak
- Progress towards next level

## Our Thought Process

We started by thinking: "What makes learning feel rewarding?" 

For us, it was:
1. **Clear progress** - You need to see what you've accomplished
2. **Skills, not just courses** - Completing a course is abstract. Earning a skill is concrete.
3. **Visualization** - Seeing your skills in a graph makes it feel real
4. **Gamification** - But not too much. Just enough to make it engaging without being distracting.

The inspiration came from a few places:
- **Habitica** - We loved how they gamified habits and tasks
- **Coursera's design** - Clean, professional, but we wanted to add some personality
- **Skill-Aligned Practice Tracking** (from Avni Yagnik and Diana Chen) - Linking verified skills to gamified progress indicators

We wanted to position Coursera as the leader in skills-based learning while making it more engaging. The idea was: "You're not just taking courses, you're building a skill profile that actually means something."

## The Motivation

Honestly? We think skills-based learning is the future. But it only works if learners can actually see and feel their progress. That's why we focused on:
- Making skills visible and tangible
- Showing connections between skills
- Making progression feel rewarding
- Keeping learners engaged with streaks and goals

The stretch ideas (like the 3D skill tree) were just us having fun and exploring what's possible. We could totally see integrating with LinkedIn or enterprise frameworks (we'd just need to mock the API calls), but for the prototype, we focused on making the core experience feel great.

## Impact / Why It Matters

This aligns with Coursera's strategic goals:
- **Skills-First Learning**: Every module maps to a verifiable skill
- **Learner Engagement**: Gamification elements keep learners coming back
- **Retention**: Daily streaks and goals encourage consistent learning
- **Clear Progression**: Learners can see exactly what skills they're building

It's about making learning feel less like a chore and more like building something meaningful - your skill profile.

## Try It Out

```bash
npm install
npm run dev
```

Then just start completing courses and watch your skills unlock! The skill graph is probably the most fun part - complete a course and see those skills light up.

---

*Built with ❤️ by Team SkillVerse for Coursera AI Spark Day*
