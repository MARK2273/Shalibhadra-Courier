import React, { type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  containerClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon: Icon,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1 transition-colors">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
        )}
        <input
          className={`block w-full ${Icon ? "pl-10" : "pl-4"} pr-4 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium text-gray-900 dark:text-white shadow-sm ${
            error
              ? "border-2 border-red-400 ring-2 ring-red-500/10 bg-red-50/50 dark:bg-red-900/20"
              : "border-gray-200 dark:border-gray-700 border"
          } ${className}`}
          {...props}
        />
      </div>
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

export default FormInput;
