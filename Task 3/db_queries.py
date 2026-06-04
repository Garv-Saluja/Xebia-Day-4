def get_monthly_attendance(conn, employee_id, month, year):
    query = """
        SELECT a.date, a.check_in, a.check_out, e.name
        FROM attendance a
        LEFT JOIN employees e                   
        ON a.employee_id = e.id
        WHERE a.month = ?                       
        AND a.year = ?
        ORDER BY a.date ASC
    """
    cursor = conn.cursor()
    # Fix B: Pass employee_id 
    cursor.execute(query, (employee_id, month, year))
    return cursor.fetchall()