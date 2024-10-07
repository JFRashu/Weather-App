import React, { useEffect, useState } from 'react';

export const CurrentInfo = () => {
    const [location, setLocation] = useState('Chittagong'); // Location fetched dynamically
    const [temperature, setTemperature] = useState(0);
    const [weatherDescription, setWeatherDescription] = useState('');
    const [weatherIcon, setWeatherIcon] = useState('');
    const [time, setTime] = useState('');
    const [humidity, setHumidity] = useState(0);
    const [windSpeed, setWindSpeed] = useState(0);
    const [feelsLike, setFeelsLike] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const apiKey = '35f673692bca555695b7d35b0386fd59'; // Your Weatherstack API key

    useEffect(() => {
        // Function to fetch weather data using lat and lon
        const fetchWeatherData = async (lat, lon) => {
            try {
                // Call the Weatherstack API
                const response = await fetch(
                    `https://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lon}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();
                console.log(data);

                // Set state with API response data
                setLocation(data.location.name); // Set the city name dynamically
                setTemperature(data.current.temperature);
                setWeatherDescription(data.current.weather_descriptions[0]);
                setWeatherIcon(data.current.weather_icons[0]);
                setTime(data.location.localtime);
                setHumidity(data.current.humidity);
                setWindSpeed(data.current.wind_speed);
                setFeelsLike(data.current.feelslike);
                setLoading(false); // Data fetched successfully
            } catch (error) {
                setError(error.message);
                setLoading(false); // Stop loading if there's an error
            }
        };

        // Get the user's current location using Geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude); // Fetch weather data using lat/lon
                },
                (error) => {
                    setError('Failed to get location');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
        }
    }, [apiKey]);

    if (loading) {
        return <div className="text-white text-center">Loading weather data...</div>;
    }

    if (error) {
        return <div className="text-white text-center">{error}</div>;
    }

    return (
        <div className="card bg-transparent align-middle items-baseline shadow-xl">
            <figure>
                {/* Display the weather icon dynamically */}
                <img src="/public/Images/sunnyday.png" alt={weatherDescription} />
            </figure>
            <div className="card-body text-white">
                <h2 className="card-title">{location || "Unknown Location"}</h2>
                <p>Current Temperature: {temperature}°C</p>
                <p>Feels Like: {feelsLike}°C</p>
                <p>Weather: {weatherDescription}</p>
                <p>Humidity: {humidity}%</p>
                <p>Wind Speed: {windSpeed} km/h</p>
                <p>Time: {time}</p>
                <div className="card-actions justify-end"></div>
            </div>
        </div>
    );
};
