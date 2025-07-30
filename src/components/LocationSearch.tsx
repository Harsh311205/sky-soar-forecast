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
    // India - States, Cities & Major Areas
    { name: 'Mumbai, Maharashtra', lat: 19.0760, lon: 72.8777, country: 'India' },
    { name: 'New Delhi, Delhi', lat: 28.6139, lon: 77.2090, country: 'India' },
    { name: 'Bangalore, Karnataka', lat: 12.9716, lon: 77.5946, country: 'India' },
    { name: 'Kolkata, West Bengal', lat: 22.5726, lon: 88.3639, country: 'India' },
    { name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707, country: 'India' },
    { name: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867, country: 'India' },
    { name: 'Pune, Maharashtra', lat: 18.5204, lon: 73.8567, country: 'India' },
    { name: 'Ahmedabad, Gujarat', lat: 23.0225, lon: 72.5714, country: 'India' },
    { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873, country: 'India' },
    { name: 'Surat, Gujarat', lat: 21.1702, lon: 72.8311, country: 'India' },
    { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lon: 80.9462, country: 'India' },
    { name: 'Kanpur, Uttar Pradesh', lat: 26.4499, lon: 80.3319, country: 'India' },
    { name: 'Nagpur, Maharashtra', lat: 21.1458, lon: 79.0882, country: 'India' },
    { name: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577, country: 'India' },
    { name: 'Thane, Maharashtra', lat: 19.2183, lon: 72.9781, country: 'India' },
    { name: 'Bhopal, Madhya Pradesh', lat: 23.2599, lon: 77.4126, country: 'India' },
    { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lon: 83.2185, country: 'India' },
    { name: 'Patna, Bihar', lat: 25.5941, lon: 85.1376, country: 'India' },
    { name: 'Vadodara, Gujarat', lat: 22.3072, lon: 73.1812, country: 'India' },
    { name: 'Ghaziabad, Uttar Pradesh', lat: 28.6692, lon: 77.4538, country: 'India' },
    { name: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573, country: 'India' },
    { name: 'Agra, Uttar Pradesh', lat: 27.1767, lon: 78.0081, country: 'India' },
    { name: 'Nashik, Maharashtra', lat: 19.9975, lon: 73.7898, country: 'India' },
    { name: 'Faridabad, Haryana', lat: 28.4089, lon: 77.3178, country: 'India' },
    { name: 'Meerut, Uttar Pradesh', lat: 28.9845, lon: 77.7064, country: 'India' },
    { name: 'Rajkot, Gujarat', lat: 22.3039, lon: 70.8022, country: 'India' },
    { name: 'Kalyan-Dombivli, Maharashtra', lat: 19.2350, lon: 73.1353, country: 'India' },
    { name: 'Vasai-Virar, Maharashtra', lat: 19.4914, lon: 72.8056, country: 'India' },
    { name: 'Varanasi, Uttar Pradesh', lat: 25.3176, lon: 82.9739, country: 'India' },
    { name: 'Srinagar, Jammu and Kashmir', lat: 34.0837, lon: 74.7973, country: 'India' },
    { name: 'Aurangabad, Maharashtra', lat: 19.8762, lon: 75.3433, country: 'India' },
    { name: 'Dhanbad, Jharkhand', lat: 23.7957, lon: 86.4304, country: 'India' },
    { name: 'Amritsar, Punjab', lat: 31.6340, lon: 74.8723, country: 'India' },
    { name: 'Navi Mumbai, Maharashtra', lat: 19.0330, lon: 73.0297, country: 'India' },
    { name: 'Allahabad, Uttar Pradesh', lat: 25.4358, lon: 81.8463, country: 'India' },
    { name: 'Ranchi, Jharkhand', lat: 23.3441, lon: 85.3096, country: 'India' },
    { name: 'Howrah, West Bengal', lat: 22.5958, lon: 88.2636, country: 'India' },
    { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lon: 76.9558, country: 'India' },
    { name: 'Jabalpur, Madhya Pradesh', lat: 23.1815, lon: 79.9864, country: 'India' },
    { name: 'Gwalior, Madhya Pradesh', lat: 26.2183, lon: 78.1828, country: 'India' },
    { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lon: 80.6480, country: 'India' },
    { name: 'Jodhpur, Rajasthan', lat: 26.2389, lon: 73.0243, country: 'India' },
    { name: 'Madurai, Tamil Nadu', lat: 9.9252, lon: 78.1198, country: 'India' },
    { name: 'Raipur, Chhattisgarh', lat: 21.2514, lon: 81.6296, country: 'India' },
    { name: 'Kota, Rajasthan', lat: 25.2138, lon: 75.8648, country: 'India' },
    { name: 'Guwahati, Assam', lat: 26.1445, lon: 91.7362, country: 'India' },
    { name: 'Chandigarh, Chandigarh', lat: 30.7333, lon: 76.7794, country: 'India' },
    { name: 'Solapur, Maharashtra', lat: 17.6599, lon: 75.9064, country: 'India' },
    { name: 'Hubballi-Dharwad, Karnataka', lat: 15.3647, lon: 75.1240, country: 'India' },
    { name: 'Tiruchirappalli, Tamil Nadu', lat: 10.7905, lon: 78.7047, country: 'India' },
    { name: 'Bareilly, Uttar Pradesh', lat: 28.3670, lon: 79.4304, country: 'India' },
    { name: 'Moradabad, Uttar Pradesh', lat: 28.8386, lon: 78.7733, country: 'India' },
    { name: 'Mysore, Karnataka', lat: 12.2958, lon: 76.6394, country: 'India' },
    { name: 'Tiruppur, Tamil Nadu', lat: 11.1085, lon: 77.3411, country: 'India' },
    { name: 'Gurgaon, Haryana', lat: 28.4595, lon: 77.0266, country: 'India' },
    { name: 'Aligarh, Uttar Pradesh', lat: 27.8974, lon: 78.0880, country: 'India' },
    { name: 'Jalandhar, Punjab', lat: 31.3260, lon: 75.5762, country: 'India' },
    { name: 'Bhubaneswar, Odisha', lat: 20.2961, lon: 85.8245, country: 'India' },
    { name: 'Salem, Tamil Nadu', lat: 11.6643, lon: 78.1460, country: 'India' },
    { name: 'Mira-Bhayandar, Maharashtra', lat: 19.2952, lon: 72.8544, country: 'India' },
    { name: 'Warangal, Telangana', lat: 17.9689, lon: 79.5941, country: 'India' },
    { name: 'Thiruvananthapuram, Kerala', lat: 8.5241, lon: 76.9366, country: 'India' },
    { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lon: 80.4365, country: 'India' },
    { name: 'Bhiwandi, Maharashtra', lat: 19.3002, lon: 73.0634, country: 'India' },
    { name: 'Saharanpur, Uttar Pradesh', lat: 29.9680, lon: 77.5552, country: 'India' },
    { name: 'Gorakhpur, Uttar Pradesh', lat: 26.7606, lon: 83.3732, country: 'India' },
    { name: 'Bikaner, Rajasthan', lat: 28.0229, lon: 73.3119, country: 'India' },
    { name: 'Amravati, Maharashtra', lat: 20.9374, lon: 77.7796, country: 'India' },
    { name: 'Noida, Uttar Pradesh', lat: 28.5355, lon: 77.3910, country: 'India' },
    { name: 'Jamshedpur, Jharkhand', lat: 22.8046, lon: 86.2029, country: 'India' },
    { name: 'Bhilai, Chhattisgarh', lat: 21.1938, lon: 81.3509, country: 'India' },
    { name: 'Cuttack, Odisha', lat: 20.4625, lon: 85.8828, country: 'India' },
    { name: 'Firozabad, Uttar Pradesh', lat: 27.1592, lon: 78.3957, country: 'India' },
    { name: 'Kochi, Kerala', lat: 9.9312, lon: 76.2673, country: 'India' },
    { name: 'Nellore, Andhra Pradesh', lat: 14.4426, lon: 79.9865, country: 'India' },
    { name: 'Bhavnagar, Gujarat', lat: 21.7645, lon: 72.1519, country: 'India' },
    { name: 'Dehradun, Uttarakhand', lat: 30.3165, lon: 78.0322, country: 'India' },
    { name: 'Durgapur, West Bengal', lat: 23.5204, lon: 87.3119, country: 'India' },
    { name: 'Asansol, West Bengal', lat: 23.6739, lon: 86.9524, country: 'India' },
    { name: 'Rourkela, Odisha', lat: 22.2604, lon: 84.8536, country: 'India' },
    { name: 'Nanded, Maharashtra', lat: 19.1383, lon: 77.3210, country: 'India' },
    { name: 'Kolhapur, Maharashtra', lat: 16.7050, lon: 74.2433, country: 'India' },
    { name: 'Ajmer, Rajasthan', lat: 26.4499, lon: 74.6399, country: 'India' },
    { name: 'Akola, Maharashtra', lat: 20.7002, lon: 77.0082, country: 'India' },
    { name: 'Gulbarga, Karnataka', lat: 17.3297, lon: 76.8343, country: 'India' },
    { name: 'Jamnagar, Gujarat', lat: 22.4707, lon: 70.0577, country: 'India' },
    { name: 'Ujjain, Madhya Pradesh', lat: 23.1765, lon: 75.7885, country: 'India' },
    { name: 'Loni, Uttar Pradesh', lat: 28.7444, lon: 77.2847, country: 'India' },
    { name: 'Siliguri, West Bengal', lat: 26.7271, lon: 88.3953, country: 'India' },
    { name: 'Jhansi, Uttar Pradesh', lat: 25.4484, lon: 78.5685, country: 'India' },
    { name: 'Ulhasnagar, Maharashtra', lat: 19.2215, lon: 73.1645, country: 'India' },
    { name: 'Jammu, Jammu and Kashmir', lat: 32.7266, lon: 74.8570, country: 'India' },
    { name: 'Sangli-Miraj & Kupwad, Maharashtra', lat: 16.8524, lon: 74.5815, country: 'India' },
    { name: 'Mangalore, Karnataka', lat: 12.9141, lon: 74.8560, country: 'India' },
    { name: 'Erode, Tamil Nadu', lat: 11.3410, lon: 77.7172, country: 'India' },
    { name: 'Belgaum, Karnataka', lat: 15.8497, lon: 74.4977, country: 'India' },
    { name: 'Ambattur, Tamil Nadu', lat: 13.1143, lon: 80.1548, country: 'India' },
    { name: 'Tirunelveli, Tamil Nadu', lat: 8.7139, lon: 77.7567, country: 'India' },
    { name: 'Malegaon, Maharashtra', lat: 20.5579, lon: 74.5287, country: 'India' },
    { name: 'Gaya, Bihar', lat: 24.7914, lon: 85.0002, country: 'India' },
    { name: 'Jalgaon, Maharashtra', lat: 21.0077, lon: 75.5626, country: 'India' },
    { name: 'Udaipur, Rajasthan', lat: 24.5854, lon: 73.7125, country: 'India' },
    { name: 'Maheshtala, West Bengal', lat: 22.4988, lon: 88.2475, country: 'India' },
    
    // Delhi NCR Areas
    { name: 'Connaught Place, Delhi', lat: 28.6315, lon: 77.2167, country: 'India' },
    { name: 'Karol Bagh, Delhi', lat: 28.6519, lon: 77.1909, country: 'India' },
    { name: 'Lajpat Nagar, Delhi', lat: 28.5677, lon: 77.2430, country: 'India' },
    { name: 'Dwarka, Delhi', lat: 28.5921, lon: 77.0460, country: 'India' },
    { name: 'Rohini, Delhi', lat: 28.7041, lon: 77.1025, country: 'India' },
    { name: 'Janakpuri, Delhi', lat: 28.6219, lon: 77.0814, country: 'India' },
    { name: 'Vasant Kunj, Delhi', lat: 28.5244, lon: 77.1598, country: 'India' },
    { name: 'Saket, Delhi', lat: 28.5245, lon: 77.2066, country: 'India' },
    { name: 'Greater Kailash, Delhi', lat: 28.5494, lon: 77.2377, country: 'India' },
    { name: 'Nehru Place, Delhi', lat: 28.5494, lon: 77.2519, country: 'India' },
    
    // Mumbai Areas
    { name: 'Andheri, Mumbai', lat: 19.1136, lon: 72.8697, country: 'India' },
    { name: 'Bandra, Mumbai', lat: 19.0596, lon: 72.8295, country: 'India' },
    { name: 'Juhu, Mumbai', lat: 19.1075, lon: 72.8263, country: 'India' },
    { name: 'Powai, Mumbai', lat: 19.1197, lon: 72.9181, country: 'India' },
    { name: 'Worli, Mumbai', lat: 19.0176, lon: 72.8181, country: 'India' },
    { name: 'Colaba, Mumbai', lat: 18.9067, lon: 72.8147, country: 'India' },
    { name: 'Fort, Mumbai', lat: 18.9338, lon: 72.8356, country: 'India' },
    { name: 'Marine Drive, Mumbai', lat: 18.9439, lon: 72.8234, country: 'India' },
    { name: 'Malad, Mumbai', lat: 19.1868, lon: 72.8482, country: 'India' },
    { name: 'Goregaon, Mumbai', lat: 19.1663, lon: 72.8526, country: 'India' },
    
    // Bangalore Areas
    { name: 'Whitefield, Bangalore', lat: 12.9698, lon: 77.7500, country: 'India' },
    { name: 'Electronic City, Bangalore', lat: 12.8456, lon: 77.6603, country: 'India' },
    { name: 'Koramangala, Bangalore', lat: 12.9279, lon: 77.6271, country: 'India' },
    { name: 'Indiranagar, Bangalore', lat: 12.9719, lon: 77.6412, country: 'India' },
    { name: 'Jayanagar, Bangalore', lat: 12.9237, lon: 77.5835, country: 'India' },
    { name: 'MG Road, Bangalore', lat: 12.9716, lon: 77.6146, country: 'India' },
    { name: 'HSR Layout, Bangalore', lat: 12.9082, lon: 77.6476, country: 'India' },
    { name: 'BTM Layout, Bangalore', lat: 12.9165, lon: 77.6101, country: 'India' },
    { name: 'Hebbal, Bangalore', lat: 13.0358, lon: 77.5970, country: 'India' },
    { name: 'Marathahalli, Bangalore', lat: 12.9591, lon: 77.6974, country: 'India' },
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