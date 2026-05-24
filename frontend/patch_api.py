import os
import re

files_to_patch = [
    r"c:\Users\Admin\Desktop\Github\goal_craft\frontend\src\app\pages\MilestoneJourney.tsx",
    r"c:\Users\Admin\Desktop\Github\goal_craft\frontend\src\app\pages\Dashboard.tsx",
    r"c:\Users\Admin\Desktop\Github\goal_craft\frontend\src\app\pages\CreateGoal.tsx",
    r"c:\Users\Admin\Desktop\Github\goal_craft\frontend\src\app\pages\Calendar.tsx",
    r"c:\Users\Admin\Desktop\Github\goal_craft\frontend\src\app\components\DailyTaskCard.tsx"
]

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if API is imported
    if "import API from" not in content and "http://localhost:8000" in content:
        # insert import after first import
        content = content.replace('import { useState', 'import API from "../api/goalApi";\nimport { useState', 1)
        if "import API from" not in content:
             content = 'import API from "../api/goalApi";\n' + content
    
    # Fix milestone journey
    content = content.replace('await fetch(`http://localhost:8000/goal/${goalId}/milestones`)', 'await API.get(`/goal/${goalId}/milestones`)')
    content = content.replace('await fetch(\n        `http://localhost:8000/goal/milestone/${milestone.id}/tasks`\n      )', 'await API.get(`/goal/milestone/${milestone.id}/tasks`)')
    content = content.replace('await fetch(\n        `http://localhost:8000/goal/task/${taskId}/complete`,\n        { method: "POST" }\n      )', 'await API.post(`/goal/task/${taskId}/complete`)')
    
    # Fix dashboard
    content = content.replace('await fetch("http://localhost:8000/goal/daily")', 'await API.get("/goal/daily")')
    
    # Fix create goal
    content = re.sub(r'await fetch\("http://localhost:8000/goal/create", \{[\s\S]*?body: JSON.stringify\(\{([^}]+)\}\),[\s\S]*?\}\)', r'await API.post("/goal/create", {\1})', content)
    
    # Fix Calendar
    content = content.replace('await fetch("http://localhost:8000/goal/daily")', 'await API.get("/goal/daily")')
    content = content.replace('await fetch(`http://localhost:8000/goal/${goalId}/milestones`)', 'await API.get(`/goal/${goalId}/milestones`)')
    content = content.replace('await fetch(`http://localhost:8000/goal/${goalId}`)', 'await API.get(`/goal/${goalId}`)')

    # Fix daily task card
    content = content.replace('await fetch(\n        `http://localhost:8000/goal/task/${id}/complete`,\n        { method: "POST" }\n      )', 'await API.post(`/goal/task/${id}/complete`)')

    # We also need to change res.json() to res.data because axios automatically parses JSON
    content = content.replace('await res.json()', 'res.data')
    content = content.replace('await dailyRes.json()', 'dailyRes.data')
    content = content.replace('await milestoneRes.json()', 'milestoneRes.data')
    content = content.replace('await goalRes.json()', 'goalRes.data')

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Patching complete!")
