
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StressRecord } from '@/types';

interface StressChartProps {
  data: StressRecord[];
  timeRange?: 'day' | 'week' | 'month';
}

const StressChart = ({ data, timeRange = 'week' }: StressChartProps) => {
  // Transform the StressRecord data for the chart
  const chartData = useMemo(() => {
    if (!data.length) return [];
    
    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedData.map(record => ({
      time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(record.timestamp).toLocaleDateString(),
      level: record.level,
      score: record.score,
      fullDate: new Date(record.timestamp),
    }));
  }, [data]);

  // Determine the label format based on the time range
  const getXAxisLabel = (item: any) => {
    if (timeRange === 'day') {
      return item.time;
    } else if (timeRange === 'week') {
      return `${item.date} ${item.time}`;
    } else {
      return item.date;
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const score = data.score;
      let stressText = '';
      let color = '';
      
      if (score < 25) {
        stressText = 'Low Stress';
        color = '#4ade80'; // green
      } else if (score < 50) {
        stressText = 'Medium Stress';
        color = '#facc15'; // yellow
      } else if (score < 75) {
        stressText = 'High Stress';
        color = '#f87171'; // light red
      } else {
        stressText = 'Severe Stress';
        color = '#ef4444'; // red
      }
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
          <p className="font-medium">{`${data.date} - ${data.time}`}</p>
          <p className="text-sm">
            Stress Score: <span className="font-medium">{score}</span>
          </p>
          <p className="text-sm">
            Status: <span style={{ color }} className="font-medium">{stressText}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getGradientOffset = () => {
    if (chartData.length === 0) {
      return { offset1: 0, offset2: 0 };
    }
    
    const dataMax = Math.max(...chartData.map(item => item.score));
    const dataMin = Math.min(...chartData.map(item => item.score));
    
    if (dataMax <= 0) {
      return { offset1: 0, offset2: 0 };
    }
    if (dataMin >= 75) {
      return { offset1: 1, offset2: 1 };
    }
    
    const offset1 = dataMin / dataMax;
    const offset2 = 75 / 100;
    
    return { offset1, offset2 };
  };
  
  const { offset1, offset2 } = getGradientOffset();

  return (
    <div className="w-full h-[300px]">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#facc15" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#4ade80" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#a0aec0" opacity={0.2} />
            <XAxis 
              dataKey={(item) => getXAxisLabel(item)}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: '#718096', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone"
              dataKey="score" 
              name="Stress Level" 
              stroke="#6366f1"
              fill="url(#stressGradient)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">No stress data available</p>
        </div>
      )}
    </div>
  );
};

export default StressChart;
