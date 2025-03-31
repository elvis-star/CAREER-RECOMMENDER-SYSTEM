import React from 'react';

export function Avatar({ children, className = '' }) {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = 'Avatar', className = '' }) {
  return (
    <img
      className={`h-full w-full object-cover ${className}`}
      src={src}
      alt={alt}
    />
  );
}

export function AvatarFallback({ children, className = '' }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gray-200 text-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}
