interface WeeklyData {
  week: string;
  km: number;
}

interface WeeklyBarChartProps {
  data: WeeklyData[];
}

export default function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const maxKm = Math.max(...data.map(d => d.km));
  // Set a reasonable target for 100% (either the max value or a round number like 1000)
  const targetKm = Math.max(maxKm, 1000);

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        // Calculate percentage based on target (0-100%)
        const percentage = Math.min(100, (item.km / targetKm) * 100);
        // Calculate relative width for visual bar (relative to max in dataset)
        const barWidth = (item.km / maxKm) * 100;

        return (
          <div key={item.week} className="flex items-center gap-3 group">
            <span className="text-sm font-medium w-8 text-gray-600">{item.week}</span>
            <div className="flex-1 relative">
              <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    animationDelay: `${index * 50}ms`
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs font-medium text-gray-700">
                  {item.km.toFixed(0)} km
                </span>
                <span className="text-xs text-gray-500">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
