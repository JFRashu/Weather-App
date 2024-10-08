import React, { useState, useEffect } from 'react';
import { ArrowRight, CloudRain, Compass, Map, Bell, X } from 'lucide-react';
import { CurrentInfo } from './CurrentInfo';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '../Components/CustomAlert';

const VideoHero = () => {
    const navigate = useNavigate();
    const [weatherAlerts, setWeatherAlerts] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch weather alerts based on location
    const fetchWeatherAlerts = async (lat, lon) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=451fe90208126ce549ad47c3769a62ad`
            );
            const data = await response.json();
            if (data.alerts) {
                setWeatherAlerts(data.alerts);
            }
        } catch (error) {
            console.error('Error fetching weather alerts:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Get user's location for weather alerts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherAlerts(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    // Weather Alert Modal Component
    const WeatherAlertModal = () => (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${showAlertModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg w-full">
                <div className="bg-white rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Bell className="h-5 w-5 text-yellow-500" />
                            Weather Alerts
                        </h3>
                        <button 
                            onClick={() => setShowAlertModal(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading alerts...</p>
                        </div>
                    ) : weatherAlerts.length > 0 ? (
                        <div className="space-y-4">
                            {weatherAlerts.map((alert, index) => (
                                <Alert key={index} variant={alert.severity === 'severe' ? 'destructive' : 'warning'}>
                                    <AlertTitle className="font-semibold">
                                        {alert.event}
                                    </AlertTitle>
                                    <AlertDescription className="mt-2 text-sm">
                                        <p>{alert.description}</p>
                                        <p className="mt-2 text-xs opacity-75">
                                            Valid until: {new Date(alert.end * 1000).toLocaleString()}
                                        </p>
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-600">
                            <p>No weather alerts for your area at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen">
            {/* Video Background - Fixed positioning */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover"
                >
                    <source src="/Videos/Back_ground.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content - Now properly overlaid on the video */}
            <div className="relative z-10 min-h-screen flex items-center pt-16 pb-8 px-4">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                        {/* Left Side - Main Content */}
                        <div className="w-full lg:w-7/12 xl:w-8/12 space-y-6">
                            <div className="flex items-center gap-2 text-white/90">
                                <CloudRain className="w-5 h-5" />
                                <span className="text-sm font-medium">Real-Time Weather Updates</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Your Accurate Weather Companion
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl">
                                Stay ahead of the weather with our precise forecasts and real-time updates.
                                From daily temperatures to severe weather alerts, get all the weather insights
                                you need for confident planning, anywhere, anytime.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                                <div className="flex items-center gap-3 text-white">
                                    <Compass className="w-5 h-5 flex-shrink-0" />
                                    <span>Hourly Forecasts</span>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <Map className="w-5 h-5 flex-shrink-0" />
                                    <span>Interactive Weather Maps</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => navigate('/forecast')} 
                                    className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-300"
                                >
                                    Check Forecast
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => setShowAlertModal(true)}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-300"
                                >
                                    <Bell className="mr-2 h-5 w-5" />
                                    Weather Alerts
                                    {weatherAlerts.length > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                            {weatherAlerts.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Current Info */}
                        <div className="w-full sm:w-3/4 lg:w-5/12 xl:w-4/12">
                            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl">
                                <CurrentInfo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather Alert Modal */}
            <WeatherAlertModal />
        </div>
    );
};

export default VideoHero;