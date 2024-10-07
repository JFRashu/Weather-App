import React, { useState } from 'react';
import { Map, Cloud, Wind, Droplets, Thermometer, Layers, Compass, Maximize2 } from 'lucide-react';

const WeatherMaps = () => {
    const [activeMap, setActiveMap] = useState('temperature');

    const mapTypes = [
        { id: 'temperature', icon: Thermometer, label: 'Temperature Map', description: 'View temperature variations across regions' },
        { id: 'precipitation', icon: Droplets, label: 'Precipitation Map', description: 'Track rainfall and precipitation patterns' },
        { id: 'wind', icon: Wind, label: 'Wind Map', description: 'Monitor wind speeds and directions' },
        { id: 'clouds', icon: Cloud, label: 'Cloud Cover', description: 'View cloud coverage and movements' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Header Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Weather Maps</h1>
                        <p className="text-gray-300">Interactive weather maps showing real-time conditions</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Change Layers
                        </button>
                        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                            <Maximize2 className="w-4 h-4" />
                            Fullscreen
                        </button>
                    </div>
                </div>

                {/* Map Selection Grid */}
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

                {/* Main Map Container */}
                <div className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-700">
                    {/* Map Controls */}
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <div className="text-white font-medium">
                            {mapTypes.find(t => t.id === activeMap)?.label}
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-gray-700/50 text-white hover:bg-gray-700 transition-colors">
                                <Compass className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg bg-gray-700/50 text-white hover:bg-gray-700 transition-colors">
                                <Map className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Map Display */}
                    <div className="relative aspect-[16/9] bg-gray-800">
                        <img 
                            src="/api/placeholder/1200/675" 
                            alt="Weather Map"
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Map Legend */}
                        <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-3">
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