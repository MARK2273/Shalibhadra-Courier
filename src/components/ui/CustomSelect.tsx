import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight, Search, type LucideIcon } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  options: (SelectOption | string)[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  isSearchable?: boolean;
  error?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  fullWidth?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  isSearchable = false,
  error,
  icon: Icon,
  disabled = false,
  fullWidth = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const isKeyboardActive = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Normalize options to { label, value } objects
  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'string') return { label: opt, value: opt };
      return opt;
    });
  }, [options]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchTerm) return normalizedOptions;
    return normalizedOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedOptions, searchTerm, isSearchable]);

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

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    isKeyboardActive.current = true;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Mouse move handler to resume mouse control
  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    // Only update if the mouse has actually moved significantly 
    // to prevent jitter from scroll-into-view
    const deltaX = Math.abs(e.screenX - lastMousePos.current.x);
    const deltaY = Math.abs(e.screenY - lastMousePos.current.y);
    
    if (deltaX > 2 || deltaY > 2) {
      isKeyboardActive.current = false;
      setHighlightedIndex(index);
    }
    
    lastMousePos.current = { x: e.screenX, y: e.screenY };
  };

  // Reset indices and focus
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
    } else {
      // Find current value index to highlight it by default
      const currentIndex = filteredOptions.findIndex(opt => opt.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [searchTerm]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        // We scroll if it's keyboard nav OR if it's the first time it opens 
        // (to show the user where their current selection is)
        const shouldScroll = isKeyboardActive.current || (isOpen && highlightedIndex === filteredOptions.findIndex(opt => opt.value === value));
        
        if (shouldScroll) {
          highlightedElement.scrollIntoView({ block: 'nearest', behavior: isKeyboardActive.current ? 'auto' : 'smooth' });
        }
      }
    }
  }, [highlightedIndex, isOpen]);

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  return (
    <div 
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`} 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl text-sm font-bold transition-all focus:outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'
        } ${
          error 
            ? 'border-2 border-red-400 ring-2 ring-red-500/10 bg-red-50/30 dark:bg-red-900/20' 
            : isOpen 
              ? 'border-primary ring-2 ring-primary/20 bg-white dark:bg-gray-900 border' 
              : 'border-gray-200 dark:border-gray-700 border hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        {Icon && <Icon className={`h-5 w-5 ${error ? 'text-red-400' : isOpen ? 'text-primary dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />}
        
        <span className={`flex-1 text-left truncate ${selectedOption ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronRight 
          className={`w-4 h-4 transition-transform duration-300 text-gray-400 dark:text-gray-500 flex-shrink-0 ${isOpen ? 'rotate-90 text-primary dark:text-blue-400' : 'rotate-0'}`} 
        />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] shadow-2xl z-[9999] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {isSearchable && (
            <div className="px-3 pb-2 pt-1 border-b border-gray-100 dark:border-gray-800 mb-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          <div 
            ref={optionsRef}
            className="max-h-60 overflow-y-auto custom-scrollbar font-bold"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = value === option.value;
                const isHighlighted = highlightedIndex === index;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between ${
                      isHighlighted
                        ? 'bg-primary text-white'
                        : isSelected
                          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span className={`truncate ${isSelected && !isHighlighted ? 'text-primary dark:text-blue-400' : ''}`}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className={`w-1.5 h-1.5 rounded-full shadow-sm flex-shrink-0 ${
                        isHighlighted ? 'bg-white' : 'bg-primary'
                      }`} />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-xs text-gray-400 italic">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
