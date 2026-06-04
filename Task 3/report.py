#Q4
def generate_summary(records):
    total_hours = 0
    late_days = 0

    # Fix A: Iterate till last index only
    for i in range(len(records)):
        record = records[i]
        total_hours += record["hours"]

        if record["is_late"]:
            late_days += 1

    # Fix B: Prevent division by zero 
    avg_hours = total_hours / len(records) if len(records) > 0 else 0

    return {
        "total_hours": round(total_hours, 2),
        "avg_hours": round(avg_hours, 2),
        "late_days": late_days,
        "days_present": len(records)
    }
#Q5
MIN_DAYS_REQUIRED = 20
MAX_LATE_DAYS = 3

def check_attendance_policy(summary):
    days_present = summary["days_present"]
    late_days = summary["late_days"]

    # Fix A:
    below_minimum = days_present < MIN_DAYS_REQUIRED

    # Fix B: 
    exceeded_late = late_days >= MAX_LATE_DAYS

    if below_minimum or exceeded_late:
        return {
            "warning": True,
            "reason": []
              + (["Below minimum attendance"] if below_minimum else [])
              + (["Exceeded late check-ins"] if exceeded_late else [])
        }

    return {
        "warning": False,
        "reason": []
    }