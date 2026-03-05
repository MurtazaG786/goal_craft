import json
from app.services.ai.planner import client

def generate_tasks(goal, milestones):

    prompt = f"""
You are a planning AI.

Goal: {goal}

Milestones:
{milestones}

For each milestone create 3–5 actionable tasks.

Return ONLY valid JSON.

Format:

{{
 "tasks":[
   {{
     "milestone": "milestone title",
     "title": "task name",
     "difficulty": "easy|medium|hard"
   }}
 ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = (response.text or "").strip()

    print("\n===== GEMINI TASK RESPONSE =====")
    print(text)
    print("================================\n")

    # remove markdown wrappers if model adds them
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(text)
    except Exception as e:
        print("TASK JSON PARSE ERROR:", e)
        return {"tasks": []}

    return data