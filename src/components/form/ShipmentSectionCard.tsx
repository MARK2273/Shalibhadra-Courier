import React from "react";
import type { LucideIcon } from "lucide-react";

interface ShipmentSectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const ShipmentSectionCard: React.FC<ShipmentSectionCardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ShipmentSectionCard;
