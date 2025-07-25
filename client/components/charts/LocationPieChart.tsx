interface LocationData {
  name: string;
  percentage: number;
  color: string;
}

interface LocationPieChartProps {
  data: LocationData[];
}

export default function LocationPieChart({ data }: LocationPieChartProps) {
  // Calculate stroke-dasharray values for pie chart
  const total = data.reduce((acc, item) => acc + item.percentage, 0);
  let cumulativePercentage = 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 group cursor-pointer">
              <div 
                className="w-3 h-3 rounded transition-all duration-200 group-hover:w-4 group-hover:h-4"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.name}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="3"
              />
              
              {/* Data segments */}
              {data.map((item, index) => {
                const startOffset = (cumulativePercentage / 100) * 100;
                const segmentLength = (item.percentage / 100) * 100;
                cumulativePercentage += item.percentage;
                
                return (
                  <path
                    key={item.name}
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray={`${segmentLength}, 100`}
                    strokeDashoffset={-startOffset}
                    className="transition-all duration-300 hover:stroke-[4]"
                    style={{
                      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                );
              })}
            </svg>
            
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
