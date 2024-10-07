import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Sun, Moon, Search, MapPin, 
  Sunrise, Sunset, Clock, 
  ThermometerSun, Wind, Droplets 
} from 'lucide-react';

const CityComparison = () => {
  const [currentCity, setCurrentCity] = useState(null);
  const [comparisonCity, setComparisonCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '451fe90208126ce549ad47c3769a62ad';

  const fetchCityData = async (lat, lon, setStateFunction) => {
    try {
      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      // Fetch prayer times using Aladhan API
      const today = new Date();
      const prayerResponse = await fetch(
        `https://api.aladhan.com/v1/calendar/${today.getFullYear()}/${today.getMonth() + 1}?latitude=${lat}&longitude=${lon}&method=2`
      );

      if (!weatherResponse.ok || !prayerResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const weatherData = await weatherResponse.json();
      const prayerData = await prayerResponse.json();

      const todayPrayers = prayerData.data[today.getDate() - 1].timings;

      setStateFunction({
        name: weatherData.name,
        country: weatherData.sys.country,
        weather: {
          temp: Math.round(weatherData.main.temp),
          feels_like: Math.round(weatherData.main.feels_like),
          humidity: weatherData.main.humidity,
          wind_speed: weatherData.wind.speed,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon
        },
        sun: {
          sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
          dayLength: calculateDayLength(
            weatherData.sys.sunrise * 1000,
            weatherData.sys.sunset * 1000
          )
        },
        prayers: {
          fajr: formatPrayerTime(todayPrayers.Fajr),
          dhuhr: formatPrayerTime(todayPrayers.Dhuhr),
          asr: formatPrayerTime(todayPrayers.Asr),
          maghrib: formatPrayerTime(todayPrayers.Maghrib),
          isha: formatPrayerTime(todayPrayers.Isha)
        }
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const calculateDayLength = (sunrise, sunset) => {
    const diff = sunset - sunrise;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatPrayerTime = (time) => {
    return time.split(' ')[0];
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = cityData.cities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectCity = (city) => {
    fetchCityData(city.coordinates.lat, city.coordinates.lon, setComparisonCity);
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {

    fetch(`/public/Database/cityData.json`)
    .then((response) => response.json())
    .then((data) => setCityData(data))
    .catch((error) => console.error("Error fetching city data:", error));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityData(latitude, longitude, setCurrentCity);
          setLoading(false);
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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading city data...</div>
      </div>
    );
  }

  const CityCard = ({ cityData, title }) => (
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
                <div className="text-white font-semibold">
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
          City Comparison
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center bg-white/10 rounded-lg p-3">
            <Search className="h-5 w-5 text-white/60 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a city to compare..."
              className="bg-transparent text-white placeholder-white/60 flex-1 outline-none"
            />
          </div>
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-xl z-10">
              {searchResults.map(city => (
                <button
                  key={city.id}
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 text-white"
                >
                  {city.name}, {city.country}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CityCard cityData={currentCity} title="Your Location" />
          <CityCard cityData={comparisonCity} title="Comparison City" />
        </div>
      </div>
    </div>
  );
};

export default CityComparison;