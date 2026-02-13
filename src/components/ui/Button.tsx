import React from "react";
import "../../styles/OneCourierTheme.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  className,
  ...props
}) => {
  return (
    <button
      className={`oc-btn oc-btn-${variant} ${className || ""}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="oc-spinner"></span> : children}
    </button>
  );
};

export default Button;
