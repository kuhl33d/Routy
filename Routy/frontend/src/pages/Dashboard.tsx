import React from 'react';
import { BarChart3, School, Route, Users } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { month: 'Jan', value: 1200 },
  { month: 'Feb', value: 1800 },
  { month: 'Mar', value: 1400 },
  { month: 'Apr', value: 2200 },
  { month: 'May', value: 1900 },
  { month: 'Jun', value: 2400 },
];

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Schools"
          value="42"
          icon={School}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Routes"
          value="156"
          icon={Route}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Users"
          value="2,847"
          icon={Users}
          trend={{ value: 4, isPositive: true }}
        />
        <StatsCard
          title="Monthly Revenue"
          value="$24,500"
          icon={BarChart3}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Revenue Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#93c5fd"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}