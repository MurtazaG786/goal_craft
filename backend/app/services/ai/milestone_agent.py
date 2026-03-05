import json
import os
from app.services.ai.planner import client

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

def generate_milestones(goal, deadline):

    prompt = f"""
You are a planning AI.

Break the goal into 3–5 milestones.

Goal: {goal}
Deadline: {deadline}

Return ONLY valid JSON.
Do not include markdown or explanations.

Format:

{{
  "milestones": [
    {{"title": "Milestone title"}}
  ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = (response.text or "").strip()

    text = text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        print("Invalid JSON returned by Gemini:")
        print(text)
        return {"milestones": []}

    return data