def assign_xp(tasks):

    xp_map = {
        "easy": 10,
        "medium": 25,
        "hard": 50
    }

    for t in tasks:
        difficulty = str(t.get("difficulty", "easy")).strip().lower()
        if difficulty not in xp_map:
            difficulty = "easy"
        t["xp"] = xp_map[difficulty]

    return tasks