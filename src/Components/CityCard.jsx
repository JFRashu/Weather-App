import React, { useEffect } from 'react'
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
  } from 'recharts';
  import { 
    Sun, Moon, Search, MapPin, 
    Sunrise, Sunset, Clock, 
    ThermometerSun, Wind, Droplets 
  } from 'lucide-react';

  import AOS from 'aos';
  import 'aos/dist/aos.css';

function CityCard({ cityData, title }) {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Duration of animations (in milliseconds)
            easing: 'ease-in-out', // Easing function for animations
            once: true, // Whether animation should happen only once or every time you scroll
        });
    }, []);
  return (
    <div className="bg-white/10 rounded-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <MapPin className="h-6 w-6 text-blue-400" />
    </div>
    {cityData && (
      <>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {cityData.name}, {cityData.country}
          </h3>
          <div className="flex items-center">
            <img 
              src={`https://openweathermap.org/img/wn/${cityData.weather.icon}@2x.png`}
              alt={cityData.weather.description}
              className="w-16 h-16"
            />
            <div className="ml-4">
              <div className="text-4xl font-bold text-white">
                {cityData.weather.temp}°C
              </div>
              <div className="text-white/60 capitalize">
                {cityData.weather.description}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
         
            <div className="flex items-center mb-2">
              <ThermometerSun className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-white/60">Feels Like</span>
            </div>
            <div className="text-xl font-semibold text-white">
              {cityData.weather.feels_like}°C
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Wind className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-white/60">Wind Speed</span>
            </div>
            <div className="text-xl font-semibold text-white">
              {cityData.weather.wind_speed} m/s
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Droplets className="h-5 w-5 text-blue-300 mr-2" />
              <span className="text-white/60">Humidity</span>
            </div>
            <div className="text-xl font-semibold text-white">
              {cityData.weather.humidity}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-white/60">Day Length</span>
            </div>
            <div className="text-xl font-semibold text-white">
              {cityData.sun.dayLength}
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sun Schedule</h3>
          <div className="flex justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Sunrise className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-white/60">Sunrise</span>
              </div>
              <div  className="text-white font-semibold">
                {cityData.sun.sunrise}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Sunset className="h-5 w-5 text-orange-400 mr-2" />
                <span className="text-white/60">Sunset</span>
              </div>
              <div className="text-white font-semibold">
                {cityData.sun.sunset}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Prayer Times</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(cityData.prayers).map(([prayer, time]) => (
              <div key={prayer} className="text-center">
                <div className="text-white/60 capitalize mb-1">{prayer}</div>
                <div className="text-white font-semibold">{time}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
  )
}

export default CityCard
