import React from "react";
import "../../styles/OneCourierTheme.css";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className={`oc-checkbox-container ${className || ""}`}>
      <input type="checkbox" className="oc-checkbox" {...props} />
      <span className="oc-checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;
