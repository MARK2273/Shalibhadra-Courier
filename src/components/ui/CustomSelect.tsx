import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-4 pr-3 py-3 bg-gray-50 border rounded-2xl text-sm font-bold text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isOpen ? 'border-primary ring-2 ring-primary/20 bg-white' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={selectedOption ? 'text-gray-800' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronRight 
          className={`w-4 h-4 transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-90 text-primary' : 'rotate-0'}`} 
        />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar font-bold">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between ${
                  value === option.value
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
