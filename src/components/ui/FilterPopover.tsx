import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import CustomSelect from './CustomSelect';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  id: string;
  label: string;
  type: 'select' | 'text';
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterPopoverProps {
  fields: FilterField[];
  currentValues: Record<string, any>;
  onApply: (values: Record<string, any>) => void;
  onClear: () => void;
  activeFilterCount: number;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  fields,
  currentValues,
  onApply,
  onClear,
  activeFilterCount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedValues, setStagedValues] = useState<Record<string, any>>(currentValues);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync staged values when currentValues change
  useEffect(() => {
    setStagedValues(currentValues);
  }, [currentValues, isOpen]);

  // Outside click handler
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleValueChange = (fieldId: string, value: any) => {
    setStagedValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleApply = () => {
    onApply(stagedValues);
    setIsOpen(false);
  };

  const handleInternalClear = () => {
    onClear();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${isOpen || activeFilterCount > 0
            ? 'bg-primary text-white border-primary shadow-lg shadow-blue-200'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
      >
        <span>Filter By</span>
        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 bg-white text-primary rounded-full text-[10px] font-black shadow-sm">
            {activeFilterCount}
          </span>
        )}
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="relative">
                <label className="block text-[10px] font-black text-gray-700 uppercase tracking-widest mb-3">
                  {field.label}
                </label>

                {field.type === 'select' && (
                  <CustomSelect
                    options={field.options || []}
                    value={stagedValues[field.id]}
                    onChange={(value) => handleValueChange(field.id, value)}
                    placeholder={field.placeholder || "Select Status"}
                  />
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={stagedValues[field.id] || ''}
                    onChange={(e) => handleValueChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                )}
              </div>
            ))}

            {/* Footer Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleInternalClear}
                className="flex-1 px-4 py-3 rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-center"
              >
                Clear Filters
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-2xl text-sm font-black hover:bg-blue-600 shadow-lg shadow-blue-200 active:scale-95 transition-all text-center"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
