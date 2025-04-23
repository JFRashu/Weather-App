import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Sun, Cloud, Droplets, Wind } from 'lucide-react';

const Forecast = () => {
  const [forecasts, setForecasts] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchForecastData = async (lat, lon) => {
      try {
          const response = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          );

          if (!response.ok) {
              throw new Error('Failed to fetch forecast data');
          }

          const data = await response.json();
          const processedForecasts = processForecastData(data.list);
          setLocation(data.city.name);
          setForecasts(processedForecasts);
          setLoading(false);
      } catch (error) {
          setError(error.message);
          setLoading(false);
      }
  };

  const processForecastData = (forecastList) => {
      const dailyForecasts = {};

      forecastList.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'long' });
          const time = date.toLocaleTimeString('en-US', { hour: 'numeric' });

          if (!dailyForecasts[day]) {
              dailyForecasts[day] = {
                  temps: [],
                  icons: [],
                  descriptions: [],
                  times: []
              };
          }

          dailyForecasts[day].temps.push(Math.round(forecast.main.temp));
          dailyForecasts[day].icons.push(forecast.weather[0].icon);
          dailyForecasts[day].descriptions.push(forecast.weather[0].description);
          dailyForecasts[day].times.push(time);
      });

      return Object.entries(dailyForecasts).map(([day, data]) => ({
          day,
          maxTemp: Math.max(...data.temps),
          minTemp: Math.min(...data.temps),
          icon: data.icons[0],
          description: data.descriptions[0],
          hourlyForecasts: data.temps.map((temp, index) => ({
              time: data.times[index],
              temp,
              icon: data.icons[index],
              description: data.descriptions[index]
          }))
      }));
  };
  const prepareHourlyChartData = (forecast) => {
    if (!forecast) return [];
    return forecast.hourlyForecasts.map(hourly => ({
      time: hourly.time,
      temperature: hourly.temp,
    }));
  };

  const prepareDailyComparisonData = () => {
    if (!forecasts) return [];
    return forecasts.map(forecast => ({
      day: forecast.day.slice(0, 3), // First three letters of day name
      highTemp: forecast.maxTemp,
      lowTemp: forecast.minTemp,
      avgTemp: Math.round(
        forecast.hourlyForecasts.reduce((sum, hour) => sum + hour.temp, 0) / 
        forecast.hourlyForecasts.length
      )
    }));
  };


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchForecastData(latitude, longitude);
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

  useEffect(() => {
    if (forecasts && forecasts.length > 0 && !selectedDay) {
      setSelectedDay(forecasts[0]);
    }
  }, [forecasts]);

  const prepareChartData = (forecast) => {
    if (!forecast) return [];
    return forecast.hourlyForecasts.map(hourly => ({
      time: hourly.time,
      temperature: hourly.temp,
    }));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading forecast data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 lg:p-8">
       <div className="container mx-auto px-4 py-24 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
          Weather Forecast Analysis for {location}
        </h1>
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">5-Day Temperature Comparison</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareDailyComparisonData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.8)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  unit="°C"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Bar dataKey="highTemp" name="High" fill="#ef4444" />
                <Bar dataKey="lowTemp" name="Low" fill="#3b82f6" />
                <Bar dataKey="avgTemp" name="Average" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {forecasts?.map((forecast, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(forecast)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedDay?.day === forecast.day
                  ? 'bg-white text-gray-900 font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {forecast.day}
            </button>
          ))}
        </div>

        {/* Main Chart Section */}
        <div className="grid gap-6 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Temperature Trend</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prepareChartData(selectedDay)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                    unit="°C"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#60a5fa"
                    fill="url(#colorTemp)"
                  />
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weather Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-6">
            <div className="flex items-center">
              <Sun className="h-8 w-8 text-yellow-400 mr-4" />
              <div>
                <p className="text-white/60">High Temperature</p>
                <p className="text-2xl font-bold text-white">
                  {selectedDay?.maxTemp}°C
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6">
            <div className="flex items-center">
              <Cloud className="h-8 w-8 text-blue-400 mr-4" />
              <div>
                <p className="text-white/60">Low Temperature</p>
                <p className="text-2xl font-bold text-white">
                  {selectedDay?.minTemp}°C
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-300 mr-4" />
              <div>
                <p className="text-white/60">Conditions</p>
                <p className="text-2xl font-bold text-white capitalize">
                  {selectedDay?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-6">
            <div className="flex items-center">
              <Wind className="h-8 w-8 text-gray-300 mr-4" />
              <div>
                <p className="text-white/60">Forecast Period</p>
                <p className="text-2xl font-bold text-white">
                  {selectedDay?.hourlyForecasts.length} Hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Forecast;