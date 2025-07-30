import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock location data - replace with real geocoding service
  const mockLocations: Location[] = [
    { name: 'New York, NY', lat: 40.7128, lon: -74.0060, country: 'USA' },
    { name: 'London, UK', lat: 51.5074, lon: -0.1278, country: 'UK' },
    { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, country: 'Japan' },
    { name: 'Paris, France', lat: 48.8566, lon: 2.3522, country: 'France' },
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, country: 'Australia' },
    { name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050, country: 'Germany' },
    { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, country: 'India' },
    { name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333, country: 'Brazil' },
    { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357, country: 'Egypt' },
    { name: 'Vancouver, Canada', lat: 49.2827, lon: -123.1207, country: 'Canada' }
  ];

  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const filtered = mockLocations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
    setShowSuggestions(true);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchLocations(value);
  };

  const handleLocationClick = (location: Location) => {
    setQuery(location.name);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = {
            name: `Current Location`,
            lat: latitude,
            lon: longitude
          };
          setQuery(location.name);
          onLocationSelect(location);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a location..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-24 h-12 text-lg weather-card border-2 focus:border-primary"
        />
        <Button
          onClick={handleCurrentLocation}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto animate-scale-in">
          {loading && (
            <div className="p-4 text-center">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </div>
          )}
          
          {suggestions.map((location, index) => (
            <div
              key={index}
              onClick={() => handleLocationClick(location)}
              className="p-3 hover:bg-secondary cursor-pointer transition-colors border-b border-border last:border-b-0 flex items-center"
            >
              <MapPin className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">{location.name}</div>
                {location.country && (
                  <div className="text-sm text-muted-foreground">{location.country}</div>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;