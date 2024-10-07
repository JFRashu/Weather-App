import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AirPollution = () => {
    const [coordinates, setCoordinates] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("");

    const API_KEY = '451fe90208126ce549ad47c3769a62ad'; // Move to environment variables
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

    // Get user's location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setCoordinates(coords);

                    // Get location name
                    try {
                        const response = await fetch(
                            `${GEO_URL}/reverse?lat=${coords.lat}&lon=${coords.lon}&limit=1&appid=${API_KEY}`
                        );
                        const data = await response.json();
                        if (data.length > 0) {
                            setLocationName(`${data[0].name}, ${data[0].country}`);
                        }
                    } catch (err) {
                        console.error("Error fetching location name:", err);
                    }
                },
                (error) => {
                    setError("Unable to get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    // Fetch air pollution data
    useEffect(() => {
        if (!coordinates) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [currentResponse, forecastResponse] = await Promise.all([
                    fetch(`${BASE_URL}/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`),
                    fetch(`${BASE_URL}/air_pollution/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}`)
                ]);

                const current = await currentResponse.json();
                const forecast = await forecastResponse.json();

                setCurrentData(current.list[0]);
                setForecastData(forecast.list);
                setError(null);
            } catch (error) {
                setError('Failed to fetch air pollution data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coordinates]);

    // Function to get AQI description and color
    const getAQIInfo = (aqi) => {
        const info = {
            1: { text: 'Good', color: 'text-green-500', bgColor: 'bg-green-100' },
            2: { text: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
            3: { text: 'Moderate', color: 'text-orange-500', bgColor: 'bg-orange-100' },
            4: { text: 'Poor', color: 'text-red-500', bgColor: 'bg-red-100' },
            5: { text: 'Very Poor', color: 'text-purple-500', bgColor: 'bg-purple-100' }
        };
        return info[aqi] || { text: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    };

    // Function to get health recommendations
    const getHealthRecommendations = (aqi) => {
        const recommendations = {
            1: "Air quality is ideal for most outdoor activities.",
            2: "Unusually sensitive people should consider reducing prolonged outdoor activities.",
            3: "People with respiratory issues should limit outdoor activities.",
            4: "Everyone should reduce outdoor activities. Sensitive groups should stay indoors.",
            5: "Avoid outdoor activities. Keep windows closed."
        };
        return recommendations[aqi] || "No recommendations available.";
    };

    // Pollutant description and units
    const pollutantInfo = {
        co: { name: 'Carbon Monoxide', unit: 'μg/m³' },
        no: { name: 'Nitric Oxide', unit: 'μg/m³' },
        no2: { name: 'Nitrogen Dioxide', unit: 'μg/m³' },
        o3: { name: 'Ozone', unit: 'μg/m³' },
        so2: { name: 'Sulphur Dioxide', unit: 'μg/m³' },
        pm2_5: { name: 'PM2.5', unit: 'μg/m³' },
        pm10: { name: 'PM10', unit: 'μg/m³' },
        nh3: { name: 'Ammonia', unit: 'μg/m³' }
    };

    if (loading && !currentData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!currentData) return null;

    const { aqi } = currentData.main;
    const { text: aqiText, color: aqiColor, bgColor } = getAQIInfo(aqi);

    return (
        <div className="space-y-6 p-4">
            {/* Main AQI Card */}
            <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Current Air Quality</h2>
                <p className={`text-lg font-bold ${aqiColor}`}>{aqiText}</p>
                <p className="mt-2 text-sm">{getHealthRecommendations(aqi)}</p>
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentData.components).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 shadow-md rounded-lg">
                        <h3 className="text-lg font-semibold">{pollutantInfo[key]?.name || key.toUpperCase()}</h3>
                        <p className="text-2xl font-bold">{value.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{pollutantInfo[key]?.unit || 'μg/m³'}</p>
                    </div>
                ))}
            </div>

          
        

        </div>
    );
};

export default AirPollution;
