import React, { useState } from 'react';
import { Map, Cloud, Wind, Droplets, Thermometer, Layers, Compass, Maximize2 } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMaps = () => {
    const [activeMap, setActiveMap] = useState('temperature');
    const API_KEY = '451fe90208126ce549ad47c3769a62ad'; // Replace with your API key

    const mapTypes = [
        { 
            id: 'temperature', 
            icon: Thermometer, 
            label: 'Temperature Map', 
            description: 'View temperature variations across regions',
            url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`
        },
        { 
            id: 'precipitation', 
            icon: Droplets, 
            label: 'Precipitation Map', 
            description: 'Track rainfall and precipitation patterns',
            url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`
        },
        { 
            id: 'wind', 
            icon: Wind, 
            label: 'Wind Map', 
            description: 'Monitor wind speeds and directions',
            url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`
        },
        { 
            id: 'clouds', 
            icon: Cloud, 
            label: 'Cloud Cover', 
            description: 'View cloud coverage and movements',
            url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`
        }
    ];

    const activeLayer = mapTypes.find(type => type.id === activeMap);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Weather Maps</h1>
                        <p className="text-gray-300">Powered by OpenWeather API</p>
                    </div>
                </div>

                {/* Map Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {mapTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setActiveMap(type.id)}
                                className={`p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-3 ${
                                    activeMap === type.id
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <Icon className="w-8 h-8" />
                                <div className="text-center">
                                    <div className="font-semibold">{type.label}</div>
                                    <div className="text-sm opacity-80">{type.description}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Map Container */}
                <div className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-700 relative">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <div className="text-white font-medium">
                            {activeLayer?.label}
                        </div>
                    </div>

                    <div className="h-[600px] relative">
                        <MapContainer
                            center={[20, 0]}
                            zoom={2}
                            className="h-full w-full z-0" // Set z-index for the map
                            scrollWheelZoom={true}
                        >
                            {/* Base Map Layer */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* Weather Layer */}
                            <TileLayer
                                attribution='&copy; OpenWeather'
                                url={activeLayer?.url}
                                opacity={0.7}
                            />
                        </MapContainer>

                        {/* Legend */}
                        <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-3 z-10"> {/* Set higher z-index for the legend */}
                            <div className="text-white text-sm mb-2">Legend</div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-white text-sm">Low</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <span className="text-white text-sm">Medium</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <span className="text-white text-sm">High</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherMaps;
