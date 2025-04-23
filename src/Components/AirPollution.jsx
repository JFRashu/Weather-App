import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Droplets, AlertTriangle } from 'lucide-react';

const AirPollution = () => {
    const [coordinates, setCoordinates] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("");

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

    // Existing useEffect hooks remain the same...
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setCoordinates(coords);

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

    // Existing helper functions remain the same...
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

    const pollutantInfo = {
        co: { name: 'Carbon Monoxide', unit: 'μg/m³', icon: Wind },
        no: { name: 'Nitric Oxide', unit: 'μg/m³', icon: Droplets },
        no2: { name: 'Nitrogen Dioxide', unit: 'μg/m³', icon: AlertTriangle },
        o3: { name: 'Ozone', unit: 'μg/m³', icon: Wind },
        so2: { name: 'Sulphur Dioxide', unit: 'μg/m³', icon: Droplets },
        pm2_5: { name: 'PM2.5', unit: 'μg/m³', icon: AlertTriangle },
        pm10: { name: 'PM10', unit: 'μg/m³', icon: AlertTriangle },
        nh3: { name: 'Ammonia', unit: 'μg/m³', icon: Droplets }
    };

    if (loading && !currentData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!currentData) return null;

    const { aqi } = currentData.main;
    const { text: aqiText, color: aqiColor, bgColor } = getAQIInfo(aqi);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Location and Overall Status */}
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Air Quality Index</h2>
                {locationName && (
                    <p className="text-gray-300 text-lg">{locationName}</p>
                )}
            </div>

            {/* Main AQI Card */}
            <div className="grid gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">Current Air Quality</h3>
                                <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full ${bgColor}`}>
                                    <span className={`text-lg font-medium ${aqiColor}`}>{aqiText}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-4xl font-bold ${aqiColor}`}>{aqi}</div>
                                <div className="text-sm text-gray-500">AQI Value</div>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-600">{getHealthRecommendations(aqi)}</p>
                    </div>
                </div>
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(currentData.components).map(([key, value]) => {
                    const PollutantIcon = pollutantInfo[key]?.icon || Wind;
                    return (
                        <div key={key} className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
                            <div className="flex items-center gap-3 mb-3">
                                <PollutantIcon className="w-6 h-6 text-blue-500" />
                                <h3 className="text-lg font-semibold text-gray-900">{pollutantInfo[key]?.name || key.toUpperCase()}</h3>
                            </div>
                            <div className="mt-2">
                                <p className="text-3xl font-bold text-gray-900">{value.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{pollutantInfo[key]?.unit || 'μg/m³'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AirPollution;