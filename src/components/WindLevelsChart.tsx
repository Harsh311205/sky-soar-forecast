import { Wind } from 'lucide-react';

interface WindData {
  surface: { speed: number; direction: number };
  h850: { speed: number; direction: number };
  h700: { speed: number; direction: number };
  h500: { speed: number; direction: number };
}

interface WindLevelsChartProps {
  windData: WindData;
}

const WindLevelsChart = ({ windData }: WindLevelsChartProps) => {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getAltitudeInfo = (level: string) => {
    const altitudes = {
      surface: { name: 'Surface', altitude: '0m', color: 'text-wind-primary' },
      h850: { name: '850 hPa', altitude: '~1,500m', color: 'text-wind-secondary' },
      h700: { name: '700 hPa', altitude: '~3,000m', color: 'text-accent' },
      h500: { name: '500 hPa', altitude: '~5,500m', color: 'text-primary' }
    };
    return altitudes[level as keyof typeof altitudes];
  };

  const windLevels = Object.entries(windData);

  return (
    <div className="space-y-6">
      {windLevels.map(([level, data], index) => {
        const altInfo = getAltitudeInfo(level);
        const maxSpeed = Math.max(...windLevels.map(([, d]) => d.speed));
        const speedPercentage = (data.speed / maxSpeed) * 100;

        return (
          <div 
            key={level} 
            className="group p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className={`font-semibold ${altInfo.color}`}>{altInfo.name}</h4>
                <p className="text-sm text-muted-foreground">{altInfo.altitude}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${altInfo.color}`}>
                    {data.speed} km/h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getWindDirection(data.direction)}
                  </div>
                </div>
                <div 
                  className={`w-8 h-8 ${altInfo.color} transition-transform duration-500 group-hover:scale-110`}
                  style={{ transform: `rotate(${data.direction}deg)` }}
                >
                  <Wind className="w-full h-full animate-wind-flow" />
                </div>
              </div>
            </div>

            {/* Wind Speed Bar */}
            <div className="relative">
              <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-wind-primary to-wind-secondary transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${speedPercentage}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 km/h</span>
                <span>{Math.round(maxSpeed)} km/h</span>
              </div>
            </div>

            {/* Wind Direction Compass */}
            <div className="mt-4 flex items-center justify-center">
              <div className="relative w-20 h-20 rounded-full border-2 border-muted/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                {/* Compass Points */}
                <div className="absolute inset-0 text-xs text-muted-foreground">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2">N</div>
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2">E</div>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">S</div>
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2">W</div>
                </div>
                
                {/* Wind Arrow */}
                <div 
                  className={`absolute w-1 h-8 ${altInfo.color} bg-current transform -translate-y-2 transition-transform duration-500`}
                  style={{ 
                    transform: `rotate(${data.direction}deg) translateY(-8px)`,
                    transformOrigin: 'bottom center'
                  }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-current" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WindLevelsChart;