interface WeeklyData {
  week: string;
  km: number;
}

interface WeeklyBarChartProps {
  data: WeeklyData[];
}

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const maxKm = Math.max(...data.map(d => d.km));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.week} className="flex items-center gap-3 group">
          <span className="text-sm font-medium w-8 text-gray-600">{item.week}</span>
          <div className="flex-1 relative">
            <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ 
                  width: `${(item.km / maxKm) * 100}%`,
                  animationDelay: `${index * 50}ms`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-xs font-medium text-gray-700">
                  {item.km} km
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                  {((item.km / maxKm) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
