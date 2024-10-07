import React, { useEffect, useState } from 'react';

export const CurrentInfo = () => {
    const [location, setLocation] = useState('Chittagong');
    const [temperature, setTemperature] = useState(0);
    const [weatherDescription, setWeatherDescription] = useState('');
    const [weatherIcon, setWeatherIcon] = useState('');
    const [time, setTime] = useState('');
    const [humidity, setHumidity] = useState(0);
    const [windSpeed, setWindSpeed] = useState(0);
    const [feelsLike, setFeelsLike] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiKey = '451fe90208126ce549ad47c3769a62ad'; // Replace with your OpenWeatherMap API key

    // Function to fetch weather data using lat and lon
    const fetchWeatherData = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            console.log("Weather Data:", data); // Log the API response for debugging

            // Set state with API response data
            setLocation(data.name); // City name
            setTemperature(Math.round(data.main.temp)); // Temperature in Celsius
            setWeatherDescription(data.weather[0].description);
            setWeatherIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            setHumidity(data.main.humidity);
            setWindSpeed(data.wind.speed);
            setFeelsLike(Math.round(data.main.feels_like));
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // Function to fetch location and update weather data
    const fetchLocationAndWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude);

                    // Set interval to update weather data every 5 minutes
                    const intervalId = setInterval(() => {
                        fetchWeatherData(latitude, longitude);
                    }, 300000); // 300000 milliseconds = 5 minutes

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
        fetchLocationAndWeather();

        // Set initial time
        const now = new Date();
        setTime(now.toLocaleString());

        // Update time every second
        const intervalId = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleString());
        }, 1000);

        // Cleanup intervals on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Removed apiKey dependency as it's not changing

    if (loading) {
        return <div className="text-white text-center">Loading weather data...</div>;
    }

    if (error) {
        return <div className="text-white text-center">{error}</div>;
    }

    return (
        <div className="card align-middle items-baseline shadow-xl">
            <div className="card-body text-white">
                <div className="flex items-center gap-4">
                    <h2 className="card-title text-2xl">{location || "Unknown Location"}</h2>
                    {weatherIcon && (
                        <img 
                            src={weatherIcon} 
                            alt={weatherDescription}
                            className="w-16 h-16"
                        />
                    )}
                </div>
                <p className="text-xl">Current Temperature: {temperature}°C</p>
                <p>Feels Like: {feelsLike}°C</p>
                <p className="capitalize">Weather: {weatherDescription}</p>
                <p>Humidity: {humidity}%</p>
                <p>Wind Speed: {(windSpeed * 3.6).toFixed(1)} km/h</p>
                <p>Time: {time}</p>
                <div className="card-actions justify-end"></div>
            </div>
        </div>
    );
};