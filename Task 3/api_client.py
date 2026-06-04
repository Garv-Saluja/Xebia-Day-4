import requests

API_BASE_URL = "https://hr-internal.company.com/api"
API_TOKEN = "your_token_here"

def get_employee(employee_id):
    url = f"{API_BASE_URL}/employees/{employee_id}"

    # Fix A: Added Authorization header 
    

    response = requests.get(url, headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    })

    # Fix B: Return None 
    if response.status_code == 404:
        return None

    data = response.json()

    return data["employee"] 