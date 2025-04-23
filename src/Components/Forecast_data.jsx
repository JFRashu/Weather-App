import React, { useEffect, useState } from 'react';

const Forecast_data = () => {
  const [forecasts, setForecasts] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey =import.meta.env.VITE_WEATHER_API_KEY;;

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

  if (loading) {
      return <div className="text-white text-center p-4">Loading forecast data...</div>;
  }

  if (error) {
      return <div className="text-white text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
          5-Day Forecast for {location}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 max-w-[2000px] mx-auto">
          {forecasts?.map((forecast, index) => (
              <div key={index} 
                  className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 
                           shadow-lg hover:shadow-xl transition-all duration-300 
                           border border-white/10 flex flex-col h-full">
                  <div className="text-center flex-none">
                      <h3 className="font-bold text-lg sm:text-xl text-white mb-2">
                          {forecast.day}
                      </h3>
                      <img 
                          src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                          alt={forecast.description}
                          className="mx-auto w-16 h-16 sm:w-20 sm:h-20"
                      />
                      <p className="capitalize text-white/90 text-base sm:text-lg mb-2">
                          {forecast.description}
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-white mb-4">
                          <span className="text-red-300">{forecast.maxTemp}°C</span>
                          <span className="mx-2">/</span>
                          <span className="text-blue-300">{forecast.minTemp}°C</span>
                      </p>
                  </div>
                  
                  <div className="flex-grow">
                      <h4 className="font-semibold text-white/90 mb-3 text-base sm:text-lg">
                          Hourly Forecast
                      </h4>
                      <div className="space-y-2 max-h-36 sm:max-h-48 overflow-y-auto 
                                    scrollbar-thin scrollbar-thumb-white/20 
                                    scrollbar-track-transparent pr-2">
                          {forecast.hourlyForecasts.map((hourly, idx) => (
                              <div key={idx} 
                                  className="flex items-center justify-between 
                                           bg-black/20 rounded-lg p-2">
                                  <span className="text-white/80 text-sm sm:text-base">
                                      {hourly.time}
                                  </span>
                                  <div className="flex items-center gap-2">
                                      <img 
                                          src={`https://openweathermap.org/img/wn/${hourly.icon}.png`}
                                          alt={hourly.description}
                                          className="w-6 h-6 sm:w-8 sm:h-8"
                                      />
                                      <span className="text-white font-medium text-sm sm:text-base">
                                          {hourly.temp}°C
                                      </span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
              <div className="text-lg sm:text-xl text-white font-semibold px-6 py-4">
                  Loading forecast data...
              </div>
          </div>
      )}

      {error && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
              <div className="text-red-400 text-lg sm:text-xl font-semibold bg-gray-800 p-4 sm:p-6 rounded-lg max-w-[90%] text-center">
                  {error}
              </div>
          </div>
      )}
    </div>
  );
}

export default Forecast_data;