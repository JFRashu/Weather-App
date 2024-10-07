import React, { useState, useEffect } from 'react';

import { 
  Sun, Moon, Search, MapPin, 
  Sunrise, Sunset, Clock, 
  ThermometerSun, Wind, Droplets 
} from 'lucide-react';
import Button from '../Components/ui/Button';
import CityCard from '../Components/CityCard';

const CityComparison = () => {
  const [currentCity, setCurrentCity] = useState(null);
  const [comparisonCity, setComparisonCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityData, setCityData] = useState(null);

  const apiKey = '451fe90208126ce549ad47c3769a62ad';

  // Quick compare cities data
  const quickCompareCities = {
    dhaka: { name: "Dhaka", coordinates: { lat:  23.777176, lon: 90.399452} },
    newYork: { name: "New York", coordinates: { lat: 40.7128, lon: -74.0060 } },
    london: { name: "London", coordinates: { lat: 51.5074, lon: -0.1278 } }
  };

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
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   if (query.length > 2) {
  //     const results = cityData.cities.filter(city => 
  //       city.name.toLowerCase().includes(query.toLowerCase())
  //     );
  //     setSearchResults(results);
  //   } else {
  //     setSearchResults([]);
  //   }
  // };
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
  // const CityCard = () => (
 
  // );
 const handleQuickCompare = (city) => {
    const selectedCity = quickCompareCities[city];
    fetchCityData(selectedCity.coordinates.lat, selectedCity.coordinates.lon, setComparisonCity);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2 && cityData?.cities) {
      const results = cityData.cities
        .filter(city => 
          city.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit to top 5 matches
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
          City Comparison
        </h1>

        {/* Search Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
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
            
            {/* Enhanced Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-700">
                {searchResults.map(city => (
                  <button
                    key={city.id}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 text-white flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{city.name}, {city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Compare Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => handleQuickCompare('dhaka')}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Compare with Dhaka
            </Button>
            <Button
              onClick={() => handleQuickCompare('newYork')}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Compare with New York
            </Button>
            <Button
              onClick={() => handleQuickCompare('london')}
              variant="outline"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Compare with London
            </Button>
          </div>
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