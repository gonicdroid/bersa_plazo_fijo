//app/components/Card.tsx
import React from 'react';

export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[(--color-card-light)] text- rounded-2xl shadow-md border-2 border-gray-100 p-4 ${className}`}>
      {children}
    </div>
  );
}