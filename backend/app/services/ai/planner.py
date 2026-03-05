
import google.genai as genai
from app.core.config import settings
import json

client=genai.Client(api_key=settings.GOOGLE_API_KEY)

def generate_plan(goal: str, deadline: str):

    prompt_text = f"""
You are an expert strategic planner.

Break the goal into milestones and daily tasks.

Goal: {goal}
Deadline: {deadline}

Return output in JSON format like this:

{{
 "milestones":[
   {{
     "title": "",
     "tasks":[]
   }}
 ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt_text)

   
    text = response.text
    plan = json.loads(text)
    return plan

