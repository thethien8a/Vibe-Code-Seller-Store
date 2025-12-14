declare module 'react-water-wave' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface WaterWaveProps {
    imageUrl?: string;
    dropRadius?: number;
    perturbance?: number;
    resolution?: number;
    interactive?: boolean;
    crossOrigin?: string;
    style?: CSSProperties;
    children?: (props: {
      pause: () => void;
      play: () => void;
      hide: () => void;
      show: () => void;
      drop: (x: number, y: number, radius: number, strength: number) => void;
    }) => ReactNode;
  }

  const WaterWave: ComponentType<WaterWaveProps>;
  export default WaterWave;
}
