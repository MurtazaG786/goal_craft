import json
from app.services.ai.planner import client
from app.core.config import settings


def generate_side_quests():
    prompt = """
    You are an AI generating gamified side quests for a productivity app.
    Generate 6 dynamic side quests across different categories (Learning, Health, Wellness, Creativity, Social).
    Each side quest should have a realistic but fun description.

    Return ONLY valid JSON in this format:
    {
      "quests": [
        {
          "title": "Quest Title",
          "description": "Short description",
          "category": "Learning | Health | Wellness | Creativity | Social",
          "xpReward": 50,
          "difficulty": "Easy | Medium | Hard"
        }
      ]
    }
    """

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return data.get("quests", [])
    except Exception as e:
        print("Error generating side quests:", e)
        return []
