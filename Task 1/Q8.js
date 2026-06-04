async function getWeather() {
    const city = "Delhi";
    const latitude = 28.6139;
    const longitude = 77.2090;

    const weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        61: "Light rain",
        80: "Rain showers",
        95: "Thunderstorm"
    };

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        const temperature = data.current_weather.temperature;
        const weatherCode = data.current_weather.weathercode;

        console.log(`City       : ${city}`);
        console.log(`Temperature: ${temperature}°C`);
        console.log(`Condition  : ${weatherCodes[weatherCode] || "Unknown"}`);
    } catch (error) {
        console.error("Failed to fetch weather data:", error.message);
    }
}

getWeather();