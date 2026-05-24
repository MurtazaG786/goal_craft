import json
import google.genai as genai
from app.core.config import settings

client = genai.Client(api_key=settings.GOOGLE_API_KEY)


def generate_plan(goal: str, deadline: str, difficulty: str, description: str):

    prompt_text = f"""
You are an expert career and productivity planner.

Create a structured learning roadmap.

User Goal: {goal}
User Description: {description}
Difficulty Level: {difficulty}
Deadline: {deadline}

Instructions:
- Create 4–6 milestones.
- Each milestone should contain multiple tasks.
- Tasks should include difficulty and XP rewards.
- Tasks must reference their milestone title.

Return JSON in this format:

{{
  "milestones":[
    {{"title":"Milestone Name"}}
  ],
  "tasks":[
    {{
      "milestone":"Milestone Name",
      "title":"Task description",
      "difficulty":"easy | medium | hard",
      "xp":10
    }}
  ]
}}
"""

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt_text)

    text = response.text
    plan = json.loads(text)
    return plan
