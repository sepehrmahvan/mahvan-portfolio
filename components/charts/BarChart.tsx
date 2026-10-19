'use client';

import { type ChartData, type ChartOptions } from 'chart.js';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import { useDirection } from '@/hooks/useDirection';
import { registerChartjs } from '@/lib/chartjs';

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  className?: string;
}

export function BarChart({ data, options, className }: BarChartProps) {
  const direction = useDirection();

  useEffect(() => {
    registerChartjs();
  }, []);

  const merged: ChartOptions<'bar'> = {
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
      <Bar data={data} options={merged} />
    </div>
  );
}
