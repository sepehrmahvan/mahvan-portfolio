'use client';

import { type ChartData, type ChartOptions } from 'chart.js';
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import { useDirection } from '@/hooks/useDirection';
import { registerChartjs } from '@/lib/chartjs';

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  className?: string;
}

export function LineChart({ data, options, className }: LineChartProps) {
  const direction = useDirection();

  useEffect(() => {
    registerChartjs();
  }, []);

  const merged: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    ...options,
    plugins: {
      ...options?.plugins,
      legend: {
        rtl: direction === 'rtl',
        ...options?.plugins?.legend,
      },
      tooltip: {
        rtl: direction === 'rtl',
        ...options?.plugins?.tooltip,
      },
    },
  };

  return (
    <div className={className ?? 'h-64 w-full'}>
      <Line data={data} options={merged} />
    </div>
  );
}
