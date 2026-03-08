# GoalCraft - Gamified Goal Achievement Platform

A futuristic, game-like web application for personal growth and goal tracking.

## 🎮 Features

### Pages
1. **Dashboard (Mission Hub)** - Daily quests, current milestone, and motivation panel
2. **Create Goal** - Beautiful form to start new adventures with AI-powered milestone generation
3. **Calendar** - Visual timeline of tasks, milestones, and deadlines
4. **Milestone Journey** - Interactive progression map showing quest path
5. **Side Quests** - Optional bonus challenges for extra XP
6. **Profile** - User stats, achievements, and progress overview

### Core Mechanics
- **XP System**: Earn experience points by completing tasks
- **Level Progression**: Level up as you accumulate XP
- **Daily Quests**: Task-based challenges with difficulty levels
- **Milestones**: Major checkpoints on the way to your goal
- **Achievements**: Unlockable badges for accomplishments
- **Streak Tracking**: Monitor consistency with daily streaks
- **Interactive Mascot**: Reacts to your progress and XP gains

### Design Features
- Dark futuristic theme with neon accents
- Glassmorphism UI elements
- Smooth animations with Motion (Framer Motion)
- Responsive layout
- Particle effects and glowing elements
- Confetti celebrations on completion
- Progress bars and visual indicators

## 🛠️ Tech Stack

- React 18
- TypeScript
- React Router for navigation
- TailwindCSS v4 for styling
- Motion (Framer Motion) for animations
- Radix UI for accessible components
- Lucide React for icons

## 📁 Project Structure

```
/src/app/
├── App.tsx           # Main app entry with router
├── routes.tsx        # Route configuration
├── components/       # Reusable components
│   ├── Layout.tsx
│   ├── TopNavigation.tsx
│   ├── Sidebar.tsx
│   ├── DailyTaskCard.tsx
│   ├── MilestoneCard.tsx
│   ├── MotivationPanel.tsx
│   └── Confetti.tsx
└── pages/           # Page components
    ├── Dashboard.tsx
    ├── CreateGoal.tsx
    ├── Calendar.tsx
    ├── MilestoneJourney.tsx
    ├── SideQuests.tsx
    └── Profile.tsx
```

## 🎨 Design System

### Colors
- **Primary**: Cyan/Blue gradient (#06b6d4 → #3b82f6)
- **Secondary**: Purple/Pink (#8b5cf6 → #ec4899)
- **Accent**: Yellow/Orange (#eab308 → #f97316)
- **Success**: Green/Emerald (#22c55e → #10b981)
- **Background**: Dark navy (#0a0e27, #0d1128)

### Typography
- **Display**: Orbitron (futuristic headlines)
- **Body**: Inter (clean, readable text)

### Animations
- Hover lifts and glows
- Progress bar fills
- Particle effects
- Confetti celebrations
- Mascot reactions
- Smooth page transitions
