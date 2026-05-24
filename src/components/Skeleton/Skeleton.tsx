import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ 
  width, 
  height, 
  borderRadius, 
  className = '', 
  style 
}: SkeletonProps) {
  return (
    <div 
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}
