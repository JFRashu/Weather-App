import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wind, Droplets, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AirPollution = ({ lat, lon }) => {
  const [currentData, setCurrentData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '451fe90208126ce549ad47c3769a62ad'; // Move to environment variables
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  // Function to fetch air pollution data
  const fetchAirPollution = async () => {
    try {
      setLoading(true);
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
        fetch(`${BASE_URL}/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      ]);

      const current = await currentResponse.json();
      const forecast = await forecastResponse.json();

      setCurrentData(current.list[0]);
      setForecastData(forecast.list);
      setError(null);
    } catch (error) {
      setError('Failed to fetch air pollution data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirPollution();
  }, [lat, lon]);

  // Function to get AQI description
  const getAQIDescription = (aqi) => {
    const descriptions = {
      1: { text: 'Good', color: 'text-green-500' },
      2: { text: 'Fair', color: 'text-yellow-500' },
      3: { text: 'Moderate', color: 'text-orange-500' },
      4: { text: 'Poor', color: 'text-red-500' },
      5: { text: 'Very Poor', color: 'text-purple-500' }
    };
    return descriptions[aqi] || { text: 'Unknown', color: 'text-gray-500' };
  };

  // Function to get health recommendations
  const getHealthRecommendations = (aqi) => {
    const recommendations = {
      1: "Air quality is ideal for most outdoor activities.",
      2: "Unusually sensitive people should consider reducing prolonged outdoor activities.",
      3: "People with respiratory issues should limit outdoor activities.",
      4: "Everyone should reduce outdoor activities. Sensitive groups should stay indoors.",
      5: "Avoid outdoor activities. Keep windows closed."
    };
    return recommendations[aqi] || "No recommendations available.";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!currentData) return null;

  const { aqi } = currentData.main;
  const { text: aqiText, color: aqiColor } = getAQIDescription(aqi);

  return (
    <div className="space-y-6 p-4">
      {/* Main AQI Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Air Quality Index</span>
            <span className={`text-2xl font-bold ${aqiColor}`}>{aqiText}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {getHealthRecommendations(aqi)}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(currentData.components).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {key.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">μg/m³</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={forecastData.slice(0, 24)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dt" 
                  tickFormatter={(timestamp) => 
                    new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit' })
                  }
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(timestamp) => 
                    new Date(timestamp * 1000).toLocaleString()
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="main.aqi" 
                  stroke="#8884d8" 
                  name="AQI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AirPollution;