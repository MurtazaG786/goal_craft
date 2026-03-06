from datetime import datetime, timedelta

def schedule_tasks(tasks, deadline):

    days = 7 
    today = datetime.today()

    schedule = []

    for i, task in enumerate(tasks):
        day = today + timedelta(days=i % days)

        schedule.append({
            **task,
            "scheduled_date": day.strftime("%Y-%m-%d")
        })

    return schedule