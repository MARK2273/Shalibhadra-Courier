import React, { type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  containerClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
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
        <input
          className={`block w-full ${Icon ? "pl-10" : "pl-4"} pr-4 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none sm:text-sm placeholder:text-gray-400 font-medium text-gray-900 shadow-sm ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default FormInput;
