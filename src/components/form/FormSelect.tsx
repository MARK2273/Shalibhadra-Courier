import React, { SelectHTMLAttributes } from "react";
import { LucideIcon, ChevronDown } from "lucide-react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: LucideIcon;
  options: { value: string | number; label: string }[] | string[];
  containerClassName?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  icon: Icon,
  options,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
        )}
        <select
          className={`block w-full ${Icon ? "pl-10" : "pl-4"} pr-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none sm:text-sm text-gray-900 font-medium shadow-sm appearance-none ${className}`}
          {...props}
        >
          {options.map((opt, idx) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={idx} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
