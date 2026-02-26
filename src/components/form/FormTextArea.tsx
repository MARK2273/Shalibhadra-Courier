import React, { type TextareaHTMLAttributes } from "react";

interface FormTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <textarea
        className={`block w-full px-4 py-3 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none sm:text-sm placeholder:text-gray-400 font-medium text-gray-900 shadow-sm resize-none ${
          error
            ? "border-2 border-red-400 ring-2 ring-red-500/10 bg-red-50/50"
            : "border-gray-200 border"
        } ${className}`}
        {...props}
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

export default FormTextArea;
