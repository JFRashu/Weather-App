import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

// // Helper function to get Bengali date (simplified)
// const getBanglaDate = (date) => {
//     const banglaMonths = [
//         'Boishakh', 'Jyoishtho', 'Asharh', 'Shrabon', 'Bhadro', 'Ashwin',
//         'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro'
//     ];

//     // Simplified conversion
//     const banglaYear = date.getFullYear() - 593;
//     const banglaMonth = banglaMonths[date.getMonth()];
//     const banglaDay = date.getDate();

//     return `${banglaDay} ${banglaMonth}, ${banglaYear}`;
// };

// // Helper function to get Hijri date (simplified)
// const getHijriDate = (date) => {
//     const hijriMonths = [
//         'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
//         'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
//         'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
//     ];

//     // Simplified conversion
//     const hijriYear = Math.floor(date.getFullYear() - 621.5);
//     const hijriMonth = hijriMonths[date.getMonth()];
//     const hijriDay = date.getDate();

//     return `${hijriDay} ${hijriMonth}, ${hijriYear}`;
// };

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

    // Date states
    const [gregorianDate, setGregorianDate] = useState('');
    const [banglaDate, setBanglaDate] = useState('');
    const [hijriDate, setHijriDate] = useState('');

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;;

    const fetchWeatherData = async (lat, lon) => {
        
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            const hijriDate = await getHijriDateFromAPI();
            console.log('Hijri Date:', hijriDate);
            setHijriDate(hijriDate);

            setLocation(data.name);
            setTemperature(Math.round(data.main.temp));
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

    useEffect(() => {
    
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    setError('Failed to get location: ' + error.message);
                    setLoading(false);
                }
            );
        }
       
        // Update time and dates every second
        const intervalId = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleString());
            setGregorianDate(now.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }));

           


        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
     // Helper function to get Bengali date from an API
     const getBanglaDateFromAPI = async () => {
        try {
            const response = await fetch('https://bangladeshcalendar.com/api/date');
            const data = await response.json();

            const { bangla_day, bangla_month, bangla_year } = data;
            return `${bangla_day} ${bangla_month}, ${bangla_year}`;
        } catch (error) {
            console.error('Error fetching Bengali date:', error);
            return 'Error fetching Bengali date';
        }
    };

    // Helper function to get Hijri date from an API
    const getHijriDateFromAPI = async () => {
        try {
            const today = new Date();
            const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

            const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${formattedDate}`);
            const data = await response.json();

            const { hijri } = data.data;
            const { day, month, year } = hijri;

            return `${day} ${month.en}, ${year}`;
        } catch (error) {
            console.error('Error fetching Hijri date:', error);
            return 'Error fetching Hijri date';
        }
    };

    if (loading) {
        return <div className="text-white text-center">Loading weather data...</div>;
    }

    if (error) {
        return <div className="text-white text-center">{error}</div>;
    }

    return (
        <div className="card shadow-xl bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="card-body text-white">
                <div className="flex items-center gap-4">
                    <h2 className="card-title text-2xl">{location}</h2>
                    {weatherIcon && (
                        <img
                            src={weatherIcon}
                            alt={weatherDescription}
                            className="w-16 h-16"
                        />
                    )}
                </div>
                <div className="space-y-2">
                    <p className="text-xl">Temperature: {temperature}°C</p>
                    <p>Feels Like: {feelsLike}°C</p>
                    <p className="capitalize">Weather: {weatherDescription}</p>
                    <p>Humidity: {humidity}%</p>
                    <p>Wind Speed: {(windSpeed * 3.6).toFixed(1)} km/h</p>

                    {/* Date Information */}
                    <div className="border-t border-white/20 mt-4 pt-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">Date Information</span>
                        </div>
                        <p>Gregorian: {gregorianDate}</p>
                        {/* <p>Bengali: {banglaDate}</p> */}
                        <p>Hijri: {hijriDate}</p>
                        <p>Time: {time}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};