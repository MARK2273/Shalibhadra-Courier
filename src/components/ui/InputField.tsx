import React from "react";
import "../../styles/OneCourierTheme.css";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  type = "text",
  icon,
  className,
  ...props
}) => {
  return (
    <div className={`oc-input-group ${className || ""}`}>
      <label className="oc-label">{label}</label>
      <div className="oc-input-wrapper">
        {icon && <span className="oc-input-icon">{icon}</span>}
        <input
          type={type}
          className={`oc-input ${icon ? "oc-input-with-icon" : ""} ${error ? "oc-input-error" : ""}`}
          {...props}
        />
      </div>
      {error && <p className="oc-error-msg">{error}</p>}
    </div>
  );
};

export default InputField;
