// CustomAlert.jsx
import React from 'react';
import { X } from 'lucide-react';

export const Alert = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 border-gray-200 text-gray-800',
    destructive: 'bg-red-100 border-red-200 text-red-800',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = '' }) => (
  <h5 className={`font-medium leading-none tracking-tight ${className}`}>
    {children}
  </h5>
);

export const AlertDescription = ({ children, className = '' }) => (
  <div className={`mt-1 text-sm opacity-90 ${className}`}>
    {children}
  </div>
);