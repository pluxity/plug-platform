import { ChartData, ChartOptions } from 'chart.js';

export type ChartUpdateMode = 'default' | 'reset' | 'resize' | 'none';

export interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'radar' | 'doughnut' | 'polarArea' | 'scatter'; 
  data: ChartData;
  options?: ChartOptions;
  width?: string;
  height?: string;
  
  updateMode?: ChartUpdateMode;
} 