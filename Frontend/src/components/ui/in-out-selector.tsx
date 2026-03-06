import React, { useState } from 'react';

type InOutState = 'in' | 'out' | null;

interface InOutSelectorProps {
  initialState?: InOutState;
  onChange?: (state: InOutState) => void;
}

export const InOutSelector: React.FC<InOutSelectorProps> = ({ initialState = null, onChange }) => {
  const [selectedState, setSelectedState] = useState<InOutState>(initialState);

  const handleInClick = () => {
    const newState = selectedState === 'in' ? null : 'in';
    setSelectedState(newState);
    onChange?.(newState);
  };

  const handleOutClick = () => {
    const newState = selectedState === 'out' ? null : 'out';
    setSelectedState(newState);
    onChange?.(newState);
  };

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={handleInClick}
        className={`
          w-20 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-2 py-2 cursor-pointer border-2
          ${selectedState === 'in' ? 'bg-red-500 text-white border-red-500' : 'border-gray-400 bg-background hover:bg-accent hover:text-accent-foreground text-gray-700'}
        `}
      >
        In
      </button>
      <button
        type="button"
        onClick={handleOutClick}
        className={`
          w-20 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-2 py-2 cursor-pointer border-2
          ${selectedState === 'out' ? 'bg-green-500 text-white border-green-500' : 'border-gray-400 bg-background hover:bg-accent hover:text-accent-foreground text-gray-700'}
        `}
      >
        Out
      </button>
    </div>
  );
};
