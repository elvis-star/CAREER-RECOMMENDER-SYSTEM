import React from 'react';

export function RadioGroup({ children, className, ...props }) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function RadioGroupItem({ id, value, onClick, checked }) {
  return (
    <input
      type="radio"
      id={id}
      name="radio-group"
      value={value}
      checked={checked}
      onChange={() => onClick(value)}
      className="hidden peer"
    />
  );
}
