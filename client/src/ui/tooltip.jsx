// Tooltip Component
export function TooltipProvider({ children }) {
  return <div className="tooltip-provider">{children}</div>;
}

export function Tooltip({ children }) {
  return <div className="tooltip">{children}</div>;
}

export function TooltipTrigger({ children }) {
  return <div className="tooltip-trigger">{children}</div>;
}

export function TooltipContent({ children }) {
  return <div className="tooltip-content">{children}</div>;
}
