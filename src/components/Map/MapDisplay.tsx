'use client';

import dynamic from 'next/dynamic';
import Skeleton from '@/components/Skeleton/Skeleton';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <Skeleton width="100%" height="100%" borderRadius={12} />
});

interface MapDisplayProps {
  center: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
}

export default function MapDisplay(props: MapDisplayProps) {
  return <LeafletMap {...props} readOnly={true} />;
}
