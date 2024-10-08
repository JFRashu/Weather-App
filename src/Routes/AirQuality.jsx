import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Wind, AlertTriangle, Heart, TrendingUp } from 'lucide-react';

const AirQuality = () => {
  const [currentAQI, setCurrentAQI] = useState(null);
  const [pollutants, setPollutants] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiKey = '451fe90208126ce549ad47c3769a62ad';

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric'
    });
  };
  const getAQICategory = (aqi) => {
    const categories = [
      { range: [0, 50], label: 'Good', color: '#10B981', textColor: 'text-emerald-500' },
      { range: [51, 100], label: 'Moderate', color: '#FBBF24', textColor: 'text-yellow-500' },
      { range: [101, 150], label: 'Unhealthy for Sensitive Groups', color: '#F59E0B', textColor: 'text-amber-500' },
      { range: [151, 200], label: 'Unhealthy', color: '#EF4444', textColor: 'text-red-500' },
      { range: [201, 300], label: 'Very Unhealthy', color: '#7C3AED', textColor: 'text-purple-500' },
      { range: [301, 500], label: 'Hazardous', color: '#991B1B', textColor: 'text-red-900' }
    ];
    
    return categories.find(cat => aqi >= cat.range[0] && aqi <= cat.range[1]) || categories[0];
  };

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50) {
      return "Air quality is satisfactory. Enjoy your outdoor activities!";
    } else if (aqi <= 100) {
      return "Air quality is acceptable. However, unusually sensitive people should consider reducing prolonged outdoor exertion.";
    } else if (aqi <= 150) {
      return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
    } else if (aqi <= 200) {
      return "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.";
    } else if (aqi <= 300) {
      return "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities.";
    } else {
      return "Health warning: everyone may experience serious health effects. Stay indoors and avoid physical activities.";
    }
  };

  const fetchAirQualityData = async (lat, lon) => {
    try {
      // Fetch current air quality
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      
      // Fetch historical data (last 5 days)
      const start = Math.floor(Date.now() / 1000) - (5 * 24 * 3600);
      const end = Math.floor(Date.now() / 1000);
      const historicalResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${apiKey}`
      );

      if (!currentResponse.ok || !historicalResponse.ok) {
        throw new Error('Failed to fetch air quality data');
      }

      const currentData = await currentResponse.json();
      const historicalData = await historicalResponse.json();

      setCurrentAQI(currentData.list[0].main.aqi);
      setPollutants(currentData.list[0].components);
      setHistoricalData(historicalData.list.map(item => ({
        timestamp: new Date(item.dt * 1000).toLocaleString(),
        aqi: item.main.aqi,
        ...item.components
      })));
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
          const { latitude, longitude } = position.coords;
          fetchAirQualityData(latitude, longitude);
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
        <div className="text-white text-xl">Loading air quality data...</div>
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

  const aqiCategory = getAQICategory(currentAQI);
 // Process historical data to show fewer points
  const processHistoricalData = (data) => {
    // Show only every 6th point (4 points per day instead of 24)
    return data.filter((_, index) => index % 6 === 0).map(item => ({
      ...item,
      timestamp: formatTimestamp(item.timestamp)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
       <div className="container mx-auto px-4 py-24 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 text-center">
          Air Quality Index Dashboard
        </h1>

        {/* Current AQI and Health Advisory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          {/* Current AQI Card */}
          <div className="bg-white/10 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Current AQI</h2>
              <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-white/60" />
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className={`text-4xl sm:text-5xl md:text-6xl font-bold ${aqiCategory.textColor}`}>
                {currentAQI}
              </div>
              <div className="text-right">
                <div className={`text-lg sm:text-xl font-semibold ${aqiCategory.textColor}`}>
                  {aqiCategory.label}
                </div>
                <div className="text-sm sm:text-base text-white/60">Air Quality Index</div>
              </div>
            </div>
          </div>

          {/* Health Advisory Card */}
          <div className="bg-white/10 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">Health Advisory</h2>
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
            </div>
            <p className="text-sm sm:text-base text-white/80">
              {getHealthRecommendation(currentAQI)}
            </p>
          </div>
        </div>

        {/* Pollutant Levels */}
        <div className="bg-white/10 rounded-lg p-4 sm:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Pollutant Levels</h2>
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
          </div>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={[pollutants]} 
                margin={{ 
                  top: 20, 
                  right: 10, 
                  left: -10, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="co" name="CO" fill="#EF4444" />
                <Bar dataKey="no2" name="NO₂" fill="#F59E0B" />
                <Bar dataKey="o3" name="O₃" fill="#10B981" />
                <Bar dataKey="pm2_5" name="PM2.5" fill="#6366F1" />
                <Bar dataKey="pm10" name="PM10" fill="#8B5CF6" />
                <Bar dataKey="so2" name="SO₂" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AQI Trend */}
        <div className="bg-white/10 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">AQI Trend (Last 5 Days)</h2>
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
          </div>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={processHistoricalData(historicalData)}
                margin={{ 
                  top: 20, 
                  right: 10, 
                  left: -10, 
                  bottom: 60 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="rgba(255,255,255,0.5)"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="aqi" 
                  name="AQI" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  dot={{ fill: '#60A5FA', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div></div>
  );
};

export default AirQuality;