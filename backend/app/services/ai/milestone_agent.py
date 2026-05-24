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
            logger.error("Milestone generation failed after retries: %s", exc)
            raise


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

    response = _generate_content(prompt)

    text = (response.text or "").strip()

    text = text.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(0))
            except json.JSONDecodeError:
                print("Invalid JSON returned by Gemini:")
                print(text)
                return {"milestones": []}
        else:
            print("Invalid JSON returned by Gemini:")
            print(text)
            return {"milestones": []}

    return data