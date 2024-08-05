document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
document.getElementById('locateMeBtn').addEventListener('click', getLocation);

const apiKey = 'a784f510b28059b7870df89b2386e987'; // Replace with your OpenWeatherMap API key

async function getWeather() {
    const location = document.getElementById('locationInput').value.trim();
    if (!location) {
        document.getElementById('weatherDisplay').innerText = 'Please enter a location.';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        console.log('Response status:', response.status); // Log response status

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data:', data); // Log weather data

        if (data.cod !== 200) {
            throw new Error(data.message || 'Error retrieving data.');
        }

        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherDisplay').innerText = `Error fetching weather data. Please try again. Details: ${error.message}`;
    }
}

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                console.log('Response status (location):', response.status); // Log response status

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Weather data by location:', data); // Log weather data

                if (data.cod !== 200) {
                    throw new Error(data.message || 'Error retrieving data.');
                }

                displayWeather(data);
            } catch (error) {
                document.getElementById('weatherDisplay').innerText = `Error fetching weather data. Please try again. Details: ${error.message}`;
            }
        }, (error) => {
            document.getElementById('weatherDisplay').innerText = `Error retrieving location. Please allow location access and try again. Details: ${error.message}`;
        });
    } else {
        document.getElementById('weatherDisplay').innerText = 'Geolocation is not supported by this browser.';
    }
}

function displayWeather(data) {
    document.getElementById('weatherDisplay').innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Temperature:</strong> ${data.main.temp} &deg;C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
}
