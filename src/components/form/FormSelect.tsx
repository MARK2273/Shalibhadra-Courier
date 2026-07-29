import React from "react";
import { type LucideIcon } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";

interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (e: any) => void;
  options: { value: string | number; label: string }[] | string[];
  icon?: LucideIcon;
  error?: string;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
  isSearchable?: boolean;
  disabled?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  icon: Icon,
  error,
  placeholder,
  containerClassName = "",
  className = "",
  isSearchable = false,
  disabled = false,
}) => {
  return (
    <div className={containerClassName}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1 transition-colors">
        {label}
      </label>
      <CustomSelect
        options={options}
        value={value}
        onChange={(val) => {
          // Check if onChange expects a standard event object or just the value
          // Most of our handlers expect { target: { value } }
          onChange({ target: { value: val, name: label.toLowerCase() } });
        }}
        icon={Icon}
        error={error}
        placeholder={placeholder}
        isSearchable={isSearchable}
        disabled={disabled}
        className={className}
      />
      <div className="h-5">
        {error && (
          <p className="mt-1 text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1 leading-none">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormSelect;
