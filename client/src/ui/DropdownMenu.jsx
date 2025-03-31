import { useState, useRef } from 'react';

export function DropdownMenu({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ children, asChild }) {
  return asChild ? children : <button className="p-2">{children}</button>;
}

export function DropdownMenuContent({ children, align = 'start' }) {
  return (
    <div
      className={`absolute ${
        align === 'end' ? 'right-0' : 'left-0'
      } mt-2 w-48 rounded-md bg-white shadow-lg dark:bg-gray-800`}
    >
      <div className="py-2">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
}
