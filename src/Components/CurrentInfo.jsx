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

    // Function to fetch weather data using lat and lon
    const fetchWeatherData = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lon}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            console.log("Weather Data:", data); // Log the API response for debugging

            // Set state with API response data
            setLocation(data.location.name); // Set the city name dynamically
            setTemperature(data.current.temperature);
            setWeatherDescription(data.current.weather_descriptions[0]);
            setWeatherIcon(data.current.weather_icons[0]);
            setHumidity(data.current.humidity);
            setWindSpeed(data.current.wind_speed);
            setFeelsLike(data.current.feelslike);
            setLoading(false); // Data fetched successfully
        } catch (error) {
            setError(error.message);
            setLoading(false); // Stop loading if there's an error
        }
    };

    // Function to fetch location and update weather data
    const fetchLocationAndWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude); // Fetch weather data using lat/lon

                    // Set interval to update weather data every minute
                    const intervalId = setInterval(() => {
                        fetchWeatherData(latitude, longitude); // Update weather data
                    }, 60000); // 60000 milliseconds = 1 minute

                    // Clear interval on component unmount
                    return () => clearInterval(intervalId);
                },
                (error) => {
                    setError('Failed to get location: ' + error.message);
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocationAndWeather(); // Call the function to fetch location and weather

        // Set initial time
        const now = new Date();
        setTime(now.toLocaleString());

        // Update time every second
        const intervalId = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleString());
        }, 1000); // Update time every second

        // Cleanup intervals on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [apiKey]); // Adding apiKey as dependency

    if (loading) {
        return <div className="text-white text-center">Loading weather data...</div>;
    }

    if (error) {
        return <div className="text-white text-center">{error}</div>;
    }

    return (
        <div className="card bg-transparent align-middle items-baseline shadow-xl">
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
