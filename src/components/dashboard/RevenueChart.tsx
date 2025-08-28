'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { DailyRevenue } from '@/lib/types';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: DailyRevenue[];
  loading?: boolean;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Revenue Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Revenue Trend</span>
          </CardTitle>
          <CardDescription>Daily revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    revenue: item.revenue,
    orders: item.orders,
    units: item.units,
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / data.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Revenue Trend</span>
        </CardTitle>
        <CardDescription>
          Daily revenue over {data.length} days • Avg: {formatCurrency(avgRevenue)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ color: '#374151', fontWeight: 'medium' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: string) => {
                  if (name === 'revenue') {
                    return [formatCurrency(value), 'Revenue'];
                  }
                  return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#000000" 
                strokeWidth={2}
                dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}