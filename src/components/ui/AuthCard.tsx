import React from "react";
import "../../styles/OneCourierTheme.css";

interface AuthCardProps {
  title: string;
  subtext?: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtext, children }) => {
  return (
    <div className="oc-auth-card">
      <div className="oc-auth-header">
        <h2>{title}</h2>
        {subtext && <p>{subtext}</p>}
      </div>
      <div className="oc-auth-body">{children}</div>
    </div>
  );
};

export default AuthCard;
