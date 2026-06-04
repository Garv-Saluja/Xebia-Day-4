SELECT 
    d.dept_name,
    e.name,
    e.salary
FROM Employees e
JOIN Departments d
    ON e.dept_id = d.dept_id
WHERE e.salary = (
    SELECT MAX(e2.salary)
    FROM Employees e2
    WHERE e2.dept_id = e.dept_id
);