'use client';

import dynamic from 'next/dynamic';
import Skeleton from '@/components/Skeleton/Skeleton';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <Skeleton width="100%" height="100%" borderRadius={12} />
});

interface MapPickerProps {
  center: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker(props: MapPickerProps) {
  return <LeafletMap {...props} readOnly={false} />;
}
