import json
import re
import time
import logging
from app.services.ai.planner import client
from app.core.config import settings

logger = logging.getLogger(__name__)


def _generate_content(prompt: str, retries: int = 2, base_delay: float = 1.0):
    last_error = None
    for attempt in range(retries + 1):
        try:
            return client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt
            )
        except Exception as exc:
            last_error = exc
            if attempt < retries:
                time.sleep(base_delay * (2 ** attempt))
                continue
            logger.error("Task generation failed after retries: %s", exc)
            raise


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

    response = _generate_content(prompt)

    text = (response.text or "").strip()

    # remove markdown wrappers if model adds them
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(text)
    except Exception as e:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(0))
            except Exception as inner:
                print("TASK JSON PARSE ERROR:", inner)
                return {"tasks": []}
        else:
            print("TASK JSON PARSE ERROR:", e)
            return {"tasks": []}

    return data