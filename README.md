# GoalCraft 🚀

GoalCraft is an **AI-powered goal planning system** that transforms high-level goals into structured milestones and daily tas.

Instead of vague goals like *“Learn Machine Learning”*, GoalCraft uses an **LLM-based planning pipeline** to automatically generate a clear roadmap.

---

## ✨ Features

- 🤖 **AI Goal Planning**
- 🎯 Automatic **Milestone Generation**
- 📅 **Daily Tasks** created from milestones
- 🎮 **Gamified Progression** (XP, Levels, Achievements)
- 📊 **Milestone Journey Visualization**
- 📅 **Calendar Tracking System**
- 👤 Customizable **Profile & Avatar**

---

## 🧠 AI Logic

The core idea behind GoalCraft is using an **LLM as a structured planning engine**.

The AI receives:

- Goal
- Description
- Difficulty preference
- Deadline

It returns **structured JSON output** containing:

```json
{
  "milestones": [
    {"title": "Learn ML Foundations"},
    {"title": "Build ML Projects"}
  ],
  "tasks": [
    {
      "milestone": "Learn ML Foundations",
      "title": "Study Linear Algebra Basics",
      "difficulty": "medium"
    }
  ]
}
