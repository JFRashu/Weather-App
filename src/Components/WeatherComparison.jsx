import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { CloudRain, Thermometer, Wind, Droplets, Gauge } from 'lucide-react';

const WeatherComparison = ({ currentCity, comparisonCity }) => {
  // Skip rendering if either city is missing
  if (!currentCity || !comparisonCity) {
    return (
      <div className="text-center text-white/60 py-8">
        Select two cities to see their comparison
      </div>
    );
  }

  // Prepare data for the comparison charts
  const barChartData = [
    {
      metric: 'Temperature (°C)',
      [currentCity.name]: currentCity.weather.temp,
      [comparisonCity.name]: comparisonCity.weather.temp,
    },
    {
      metric: 'Feels Like (°C)',
      [currentCity.name]: currentCity.weather.feels_like,
      [comparisonCity.name]: comparisonCity.weather.feels_like,
    },
    {
      metric: 'Humidity (%)',
      [currentCity.name]: currentCity.weather.humidity,
      [comparisonCity.name]: comparisonCity.weather.humidity,
    },
    {
      metric: 'Wind (m/s)',
      [currentCity.name]: currentCity.weather.wind_speed,
      [comparisonCity.name]: comparisonCity.weather.wind_speed,
    }
  ];

  // Prepare data for radar chart
  const radarData = [
    {
      metric: 'Temperature',
      [currentCity.name]: normalizeValue(currentCity.weather.temp, -20, 50),
      [comparisonCity.name]: normalizeValue(comparisonCity.weather.temp, -20, 50),
    },
    {
      metric: 'Humidity',
      [currentCity.name]: normalizeValue(currentCity.weather.humidity, 0, 100),
      [comparisonCity.name]: normalizeValue(comparisonCity.weather.humidity, 0, 100),
    },
    {
      metric: 'Wind Speed',
      [currentCity.name]: normalizeValue(currentCity.weather.wind_speed, 0, 20),
      [comparisonCity.name]: normalizeValue(comparisonCity.weather.wind_speed, 0, 20),
    },
    {
      metric: 'Feels Like',
      [currentCity.name]: normalizeValue(currentCity.weather.feels_like, -20, 50),
      [comparisonCity.name]: normalizeValue(comparisonCity.weather.feels_like, -20, 50),
    }
  ];

  return (
    <div className="mt-12 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Weather Comparison</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Direct Comparison</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="metric" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
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
                <Bar dataKey={currentCity.name} fill="#60A5FA" />
                <Bar dataKey={comparisonCity.name} fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Overall Pattern</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="metric"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                />
                <Radar
                  name={currentCity.name}
                  dataKey={currentCity.name}
                  stroke="#60A5FA"
                  fill="#60A5FA"
                  fillOpacity={0.3}
                />
                <Radar
                  name={comparisonCity.name}
                  dataKey={comparisonCity.name}
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weather Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {getWeatherMetrics(currentCity, comparisonCity).map((metric, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              {metric.icon}
              <h4 className="text-white font-medium">{metric.label}</h4>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-blue-400">
                {currentCity.name}: {metric.current}
              </span>
              <span className="text-yellow-400">
                {comparisonCity.name}: {metric.comparison}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to normalize values for radar chart (0-100 scale)
const normalizeValue = (value, min, max) => {
  return ((value - min) / (max - min)) * 100;
};

// Helper function to get weather metrics for the summary cards
const getWeatherMetrics = (currentCity, comparisonCity) => [
  {
    label: 'Temperature',
    icon: <Thermometer className="h-5 w-5 text-red-400" />,
    current: `${currentCity.weather.temp}°C`,
    comparison: `${comparisonCity.weather.temp}°C`,
  },
  {
    label: 'Humidity',
    icon: <Droplets className="h-5 w-5 text-blue-400" />,
    current: `${currentCity.weather.humidity}%`,
    comparison: `${comparisonCity.weather.humidity}%`,
  },
  {
    label: 'Wind Speed',
    icon: <Wind className="h-5 w-5 text-green-400" />,
    current: `${currentCity.weather.wind_speed} m/s`,
    comparison: `${comparisonCity.weather.wind_speed} m/s`,
  },
  {
    label: 'Feels Like',
    icon: <Gauge className="h-5 w-5 text-purple-400" />,
    current: `${currentCity.weather.feels_like}°C`,
    comparison: `${comparisonCity.weather.feels_like}°C`,
  },
];

export default WeatherComparison;