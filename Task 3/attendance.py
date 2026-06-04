from datetime import datetime

WORK_START = "09:00"
LATE_THRESHOLD_MINUTES = 15

def calculate_hours(check_in: str, check_out: str):
    fmt = "%H:%M"
    ci = datetime.strptime(check_in, fmt)
    co = datetime.strptime(check_out, fmt)

    # Fix A: co-ci
    duration = co - ci
    hours_worked = duration.seconds / 3600

    start = datetime.strptime(WORK_START, fmt)
    late_by = (ci - start).seconds // 60

    # Fix B: flag the employee who is exactly 15 minutes late 
    is_late = late_by >= LATE_THRESHOLD_MINUTES

    return round(hours_worked, 2), is_late