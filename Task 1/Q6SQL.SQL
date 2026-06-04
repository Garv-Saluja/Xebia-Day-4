SELECT
    MONTHNAME(order_date) AS month,
    SUM(amount) AS total_revenue,
    COUNT(*) AS total_orders
FROM Orders
WHERE YEAR(order_date) = 2024
GROUP BY MONTH(order_date), MONTHNAME(order_date)
ORDER BY total_revenue DESC;