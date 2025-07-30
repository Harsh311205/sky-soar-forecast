import { useState, useEffect } from 'react';
import { Search, Wind, Eye, Droplets, Gauge, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import WindLevelsChart from './WindLevelsChart';
import LocationSearch from './LocationSearch';

interface WeatherData {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    pressure: number;
    visibility: number;
    description: string;
  };
  windLevels: {
    surface: { speed: number; direction: number };
    h850: { speed: number; direction: number };
    h700: { speed: number; direction: number };
    h500: { speed: number; direction: number };
  };
}

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number; lon: number; name: string} | null>(null);

  const fetchWeatherData = async (lat: number, lon: number, locationName: string) => {
    setLoading(true);
    try {
      // Simulate API call to Windy API - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - replace with real Windy API integration
      const mockData: WeatherData = {
        location: { name: locationName, lat, lon },
        current: {
          temperature: Math.round(15 + Math.random() * 20),
          windSpeed: Math.round(5 + Math.random() * 25),
          windDirection: Math.round(Math.random() * 360),
          humidity: Math.round(40 + Math.random() * 50),
          pressure: Math.round(1000 + Math.random() * 50),
          visibility: Math.round(5 + Math.random() * 15),
          description: 'Partly cloudy'
        },
        windLevels: {
          surface: { 
            speed: Math.round(5 + Math.random() * 25), 
            direction: Math.round(Math.random() * 360) 
          },
          h850: { 
            speed: Math.round(10 + Math.random() * 35), 
            direction: Math.round(Math.random() * 360) 
          },
          h700: { 
            speed: Math.round(15 + Math.random() * 45), 
            direction: Math.round(Math.random() * 360) 
          },
          h500: { 
            speed: Math.round(20 + Math.random() * 55), 
            direction: Math.round(Math.random() * 360) 
          }
        }
      };
      
      setWeatherData(mockData);
      toast({
        title: "Weather data updated",
        description: `Showing forecast for ${locationName}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: {lat: number; lon: number; name: string}) => {
    setSelectedLocation(location);
    fetchWeatherData(location.lat, location.lon, location.name);
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  // Load default location on mount
  useEffect(() => {
    // Default to New York
    handleLocationSelect({ lat: 40.7128, lon: -74.0060, name: "New York, NY" });
  }, []);

  return (
    <div className="min-h-screen bg-sky-gradient p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">Wind Weather Forecast</h1>
          <p className="text-muted-foreground text-lg">Real-time wind data at multiple altitudes</p>
        </div>

        {/* Location Search */}
        <div className="mb-8 animate-scale-in">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span className="text-lg text-muted-foreground">Loading weather data...</span>
          </div>
        )}

        {weatherData && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Current Location */}
            <Card className="weather-card">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold">{weatherData.location.name}</h2>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {weatherData.current.temperature}°C
                </div>
                <p className="text-muted-foreground">{weatherData.current.description}</p>
              </div>
            </Card>

            {/* Large Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Wind Card */}
              <Card className="metric-card group hover:shadow-xl transition-all duration-300">
                <Wind className="h-8 w-8 text-wind-primary mx-auto mb-3 animate-wind-flow" />
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Wind Speed</h3>
                <div className="text-2xl font-bold text-wind-primary mb-1">
                  {weatherData.current.windSpeed} km/h
                </div>
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <div 
                    className="w-4 h-4 mr-1 transition-transform duration-500"
                    style={{ transform: `rotate(${weatherData.current.windDirection}deg)` }}
                  >
                    ↑
                  </div>
                  {getWindDirection(weatherData.current.windDirection)}
                </div>
              </Card>

              {/* Humidity Card */}
              <Card className="metric-card group hover:shadow-xl transition-all duration-300">
                <Droplets className="h-8 w-8 text-humidity mx-auto mb-3 animate-float" />
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Humidity</h3>
                <div className="text-2xl font-bold text-humidity mb-1">
                  {weatherData.current.humidity}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {weatherData.current.humidity > 70 ? 'High' : weatherData.current.humidity > 40 ? 'Moderate' : 'Low'}
                </div>
              </Card>

              {/* Visibility Card */}
              <Card className="metric-card group hover:shadow-xl transition-all duration-300">
                <Eye className="h-8 w-8 text-visibility mx-auto mb-3 animate-float" />
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Visibility</h3>
                <div className="text-2xl font-bold text-visibility mb-1">
                  {weatherData.current.visibility} km
                </div>
                <div className="text-sm text-muted-foreground">
                  {weatherData.current.visibility > 10 ? 'Excellent' : weatherData.current.visibility > 5 ? 'Good' : 'Limited'}
                </div>
              </Card>

              {/* Pressure Card */}
              <Card className="metric-card group hover:shadow-xl transition-all duration-300">
                <Gauge className="h-8 w-8 text-pressure mx-auto mb-3 animate-float" />
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Pressure</h3>
                <div className="text-2xl font-bold text-pressure mb-1">
                  {weatherData.current.pressure} hPa
                </div>
                <div className="text-sm text-muted-foreground">
                  {weatherData.current.pressure > 1020 ? 'High' : weatherData.current.pressure > 1000 ? 'Normal' : 'Low'}
                </div>
              </Card>
            </div>

            {/* Wind Levels Chart */}
            <Card className="weather-card">
              <h3 className="text-xl font-semibold mb-6 text-center">Wind at Different Altitudes</h3>
              <WindLevelsChart windData={weatherData.windLevels} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;