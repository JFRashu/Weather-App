import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Search, MapPin, 
  Sunrise, Sunset, Clock, 
  ThermometerSun, Wind, Droplets 
} from 'lucide-react';
import Button from '../Components/ui/Button';
import CityCard from '../Components/CityCard';
import WeatherComparison from '../Components/WeatherComparison';
import { Alert, AlertDescription, AlertTitle } from '../Components/CustomAlert';

const CityComparison = () => {
  const [currentCity, setCurrentCity] = useState(null);
  const [comparisonCity, setComparisonCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const apiKey = '451fe90208126ce549ad47c3769a62ad';

  const quickCompareCities = {
    dhaka: { name: "Dhaka", coordinates: { lat: 23.777176, lon: 90.399452} },
    newYork: { name: "New York", coordinates: { lat: 40.7128, lon: -74.0060 } },
    london: { name: "London", coordinates: { lat: 51.5074, lon: -0.1278 } }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCityNotFound(false);
    setShowAlert(false);
    
    if (query.trim() && cityData?.cities) {
      const results = cityData.cities
        .filter(city => {
          const searchLower = query.toLowerCase();
          return (
            city.name.toLowerCase().includes(searchLower) ||
            city.country.toLowerCase().includes(searchLower)
          );
        })
        .slice(0, 6);
      setSearchResults(results);
      if (results.length === 0 && query.length > 2) {
        setCityNotFound(true);
        setShowAlert(true);
      }
    } else {
      setSearchResults([]);
    }
  };

  const fetchCityData = async (lat, lon, setStateFunction) => {
    try {
      setLoading(true);
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
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
      setShowAlert(true);
    } finally {
      setLoading(false);
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

  const selectCity = (city) => {
    fetchCityData(city.coordinates.lat, city.coordinates.lon, setComparisonCity);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleQuickCompare = (city) => {
    const selectedCity = quickCompareCities[city];
    fetchCityData(selectedCity.coordinates.lat, selectedCity.coordinates.lon, setComparisonCity);
  };

  useEffect(() => {
    fetch(`/public/Database/cityData.json`)
      .then((response) => response.json())
      .then((data) => setCityData(data))
      .catch((error) => {
        console.error("Error fetching city data:", error);
        setError("Failed to load city database");
        setShowAlert(true);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityData(latitude, longitude, setCurrentCity);
          setLoading(false);
        },
        (error) => {
          setError('Failed to get location: ' + error.message);
          setShowAlert(true);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setShowAlert(true);
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-24 md:py-28 lg:py-32">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6">
            Compare Weather Worldwide
          </h1>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Compare weather conditions, prayer times, and daylight information between your location and cities around the world.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="flex items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 focus-within:border-white/20 focus-within:bg-white/15">
              <Search className="h-5 w-5 text-white/60 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for any city..."
                className="bg-transparent text-white placeholder-white/60 flex-1 outline-none text-lg"
              />
            </div>

            {/* City Not Found Alert */}
            {showAlert && cityNotFound && (
              <div className="mt-4">
                <Alert variant="destructive">
                  <AlertTitle>City Not Found</AlertTitle>
                  <AlertDescription>
                    Sorry, we couldn't find the city you're looking for. Please try another search.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl z-10 border border-gray-700 overflow-hidden">
                {searchResults.map((city, index) => (
                  <button
                    key={city.id || index}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 text-white flex items-center space-x-3 transition-colors duration-200"
                  >
                    <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{city.name}</span>
                      <span className="text-gray-400 ml-2">{city.country}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Compare Section */}
          <div className="mt-6">
            <p className="text-white/70 text-center mb-4">Quick Compare with Popular Cities</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.entries(quickCompareCities).map(([key, city]) => (
                <Button
                  key={key}
                  onClick={() => handleQuickCompare(key)}
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 px-6 py-2 rounded-full"
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* City Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="h-full">
            {comparisonCity ? (
              <CityCard 
                cityData={comparisonCity} 
                title="Comparison City" 
                className="h-full backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/10"
              />
            ) : (
              <div className="h-full backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/10 flex items-center justify-center">
                <div className="text-center text-white/70">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">No City Selected</p>
                  <p>Use the search bar above to select a city to compare</p>
                </div>
              </div>
            )}
          </div>
          <div className="h-full">
            <CityCard 
              cityData={currentCity} 
              title="Your Location" 
              className="h-full backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/10"
            />
          </div>
        </div>

        {/* Weather Comparison Section */}
        {currentCity && (
          <div className="mt-12">
            {comparisonCity ? (
              <WeatherComparison
                currentCity={currentCity}
                comparisonCity={comparisonCity}
              />
            ) : (
              <div className="text-center text-white/70 p-8 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/10">
                <p className="text-xl font-medium">Add a city to compare weather conditions</p>
                <p className="mt-2">Search for a city above to see detailed weather comparisons</p>
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {showAlert && error && (
          <div className="fixed bottom-4 right-4 max-w-md">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading city data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityComparison;