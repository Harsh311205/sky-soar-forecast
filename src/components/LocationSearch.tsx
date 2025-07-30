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

  // Comprehensive worldwide location data
  const mockLocations: Location[] = [
    // North America
    { name: 'New York, NY', lat: 40.7128, lon: -74.0060, country: 'USA' },
    { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437, country: 'USA' },
    { name: 'Chicago, IL', lat: 41.8781, lon: -87.6298, country: 'USA' },
    { name: 'Miami, FL', lat: 25.7617, lon: -80.1918, country: 'USA' },
    { name: 'Seattle, WA', lat: 47.6062, lon: -122.3321, country: 'USA' },
    { name: 'Toronto, Canada', lat: 43.6532, lon: -79.3832, country: 'Canada' },
    { name: 'Vancouver, Canada', lat: 49.2827, lon: -123.1207, country: 'Canada' },
    { name: 'Mexico City, Mexico', lat: 19.4326, lon: -99.1332, country: 'Mexico' },
    
    // Europe
    { name: 'London, UK', lat: 51.5074, lon: -0.1278, country: 'UK' },
    { name: 'Paris, France', lat: 48.8566, lon: 2.3522, country: 'France' },
    { name: 'Berlin, Germany', lat: 52.5200, lon: 13.4050, country: 'Germany' },
    { name: 'Madrid, Spain', lat: 40.4168, lon: -3.7038, country: 'Spain' },
    { name: 'Rome, Italy', lat: 41.9028, lon: 12.4964, country: 'Italy' },
    { name: 'Amsterdam, Netherlands', lat: 52.3676, lon: 4.9041, country: 'Netherlands' },
    { name: 'Vienna, Austria', lat: 48.2082, lon: 16.3738, country: 'Austria' },
    { name: 'Stockholm, Sweden', lat: 59.3293, lon: 18.0686, country: 'Sweden' },
    { name: 'Copenhagen, Denmark', lat: 55.6761, lon: 12.5683, country: 'Denmark' },
    { name: 'Oslo, Norway', lat: 59.9139, lon: 10.7522, country: 'Norway' },
    { name: 'Helsinki, Finland', lat: 60.1699, lon: 24.9384, country: 'Finland' },
    { name: 'Warsaw, Poland', lat: 52.2297, lon: 21.0122, country: 'Poland' },
    { name: 'Prague, Czech Republic', lat: 50.0755, lon: 14.4378, country: 'Czech Republic' },
    { name: 'Budapest, Hungary', lat: 47.4979, lon: 19.0402, country: 'Hungary' },
    { name: 'Moscow, Russia', lat: 55.7558, lon: 37.6176, country: 'Russia' },
    
    // Asia
    { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, country: 'Japan' },
    { name: 'Seoul, South Korea', lat: 37.5665, lon: 126.9780, country: 'South Korea' },
    { name: 'Beijing, China', lat: 39.9042, lon: 116.4074, country: 'China' },
    { name: 'Shanghai, China', lat: 31.2304, lon: 121.4737, country: 'China' },
    { name: 'Hong Kong', lat: 22.3193, lon: 114.1694, country: 'Hong Kong' },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
    { name: 'Bangkok, Thailand', lat: 13.7563, lon: 100.5018, country: 'Thailand' },
    { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, country: 'India' },
    { name: 'New Delhi, India', lat: 28.6139, lon: 77.2090, country: 'India' },
    { name: 'Bangalore, India', lat: 12.9716, lon: 77.5946, country: 'India' },
    { name: 'Jakarta, Indonesia', lat: -6.2088, lon: 106.8456, country: 'Indonesia' },
    { name: 'Manila, Philippines', lat: 14.5995, lon: 120.9842, country: 'Philippines' },
    { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lon: 101.6869, country: 'Malaysia' },
    { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, country: 'UAE' },
    { name: 'Doha, Qatar', lat: 25.2854, lon: 51.5310, country: 'Qatar' },
    { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lon: 46.6753, country: 'Saudi Arabia' },
    { name: 'Tel Aviv, Israel', lat: 32.0853, lon: 34.7818, country: 'Israel' },
    { name: 'Istanbul, Turkey', lat: 41.0082, lon: 28.9784, country: 'Turkey' },
    
    // Africa
    { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357, country: 'Egypt' },
    { name: 'Lagos, Nigeria', lat: 6.5244, lon: 3.3792, country: 'Nigeria' },
    { name: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219, country: 'Kenya' },
    { name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241, country: 'South Africa' },
    { name: 'Johannesburg, South Africa', lat: -26.2041, lon: 28.0473, country: 'South Africa' },
    { name: 'Casablanca, Morocco', lat: 33.5731, lon: -7.5898, country: 'Morocco' },
    { name: 'Tunis, Tunisia', lat: 36.8065, lon: 10.1815, country: 'Tunisia' },
    { name: 'Addis Ababa, Ethiopia', lat: 9.1450, lon: 40.4897, country: 'Ethiopia' },
    
    // South America
    { name: 'São Paulo, Brazil', lat: -23.5505, lon: -46.6333, country: 'Brazil' },
    { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
    { name: 'Buenos Aires, Argentina', lat: -34.6118, lon: -58.3960, country: 'Argentina' },
    { name: 'Santiago, Chile', lat: -33.4489, lon: -70.6693, country: 'Chile' },
    { name: 'Lima, Peru', lat: -12.0464, lon: -77.0428, country: 'Peru' },
    { name: 'Bogotá, Colombia', lat: 4.7110, lon: -74.0721, country: 'Colombia' },
    { name: 'Caracas, Venezuela', lat: 10.4806, lon: -66.9036, country: 'Venezuela' },
    { name: 'Quito, Ecuador', lat: -0.1807, lon: -78.4678, country: 'Ecuador' },
    
    // Oceania
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, country: 'Australia' },
    { name: 'Melbourne, Australia', lat: -37.8136, lon: 144.9631, country: 'Australia' },
    { name: 'Brisbane, Australia', lat: -27.4698, lon: 153.0251, country: 'Australia' },
    { name: 'Perth, Australia', lat: -31.9505, lon: 115.8605, country: 'Australia' },
    { name: 'Auckland, New Zealand', lat: -36.8485, lon: 174.7633, country: 'New Zealand' },
    { name: 'Wellington, New Zealand', lat: -41.2924, lon: 174.7787, country: 'New Zealand' },
    
    // Island Nations & Territories
    { name: 'Honolulu, Hawaii', lat: 21.3099, lon: -157.8581, country: 'USA' },
    { name: 'Reykjavik, Iceland', lat: 64.1466, lon: -21.9426, country: 'Iceland' },
    { name: 'Dublin, Ireland', lat: 53.3498, lon: -6.2603, country: 'Ireland' },
    { name: 'Lisbon, Portugal', lat: 38.7223, lon: -9.1393, country: 'Portugal' },
    { name: 'Athens, Greece', lat: 37.9838, lon: 23.7275, country: 'Greece' },
    { name: 'Nicosia, Cyprus', lat: 35.1856, lon: 33.3823, country: 'Cyprus' },
    { name: 'Malta', lat: 35.9375, lon: 14.3754, country: 'Malta' },
    { name: 'Maldives', lat: 3.2028, lon: 73.2207, country: 'Maldives' },
    { name: 'Fiji', lat: -17.7134, lon: 178.0650, country: 'Fiji' }
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

    setSuggestions(filtered.slice(0, 8));
    setShowSuggestions(true);
    setLoading(false);
  };

  const handleSearch = () => {
    if (query.length >= 2) {
      searchLocations(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  // Popular cities for quick access
  const popularCities: Location[] = [
    { name: 'New York, NY', lat: 40.7128, lon: -74.0060, country: 'USA' },
    { name: 'London, UK', lat: 51.5074, lon: -0.1278, country: 'UK' },
    { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, country: 'Japan' },
    { name: 'Paris, France', lat: 48.8566, lon: 2.3522, country: 'France' },
    { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, country: 'UAE' },
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, country: 'Australia' },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
    { name: 'Mumbai, India', lat: 19.0760, lon: 72.8777, country: 'India' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search cities worldwide (e.g., New York, London, Tokyo)..."
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(true)}
              className="pl-12 pr-4 h-14 text-lg weather-card border-2 focus:border-primary"
            />
          </div>
          
          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={loading || query.length < 2}
            className="h-14 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Search
              </>
            )}
          </Button>
          
          {/* Current Location Button */}
          <Button
            onClick={handleCurrentLocation}
            disabled={loading}
            variant="outline"
            className="h-14 px-4 border-2 hover:bg-secondary"
            title="Use current location"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto animate-scale-in">
            {loading && (
              <div className="p-6 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Searching worldwide locations...</p>
              </div>
            )}
            
            {suggestions.map((location, index) => (
              <div
                key={index}
                onClick={() => handleLocationClick(location)}
                className="p-4 hover:bg-secondary cursor-pointer transition-colors border-b border-border last:border-b-0 flex items-center group"
              >
                <MapPin className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <div className="font-medium text-base">{location.name}</div>
                  {location.country && (
                    <div className="text-sm text-muted-foreground">{location.country}</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to select
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Popular Cities Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center text-muted-foreground">
          Popular Cities Around the World
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularCities.map((city, index) => (
            <Button
              key={index}
              onClick={() => handleLocationClick(city)}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center text-center hover:bg-secondary/80 hover:border-primary/50 transition-all duration-200 group"
            >
              <MapPin className="h-4 w-4 mb-1 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="text-sm font-medium">{city.name.split(',')[0]}</div>
              <div className="text-xs text-muted-foreground">{city.country}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Search from {mockLocations.length}+ cities worldwide</p>
      </div>
    </div>
  );
};

export default LocationSearch;