import React from "react";
import { createPortal } from "react-dom";
import { type LucideIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isConfirmLoading?: boolean;
  variant?: "danger" | "primary" | "warning";
  icon?: LucideIcon;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isConfirmLoading = false,
  variant = "primary",
  icon: Icon,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700 shadow-md shadow-red-200",
    },
    primary: {
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      buttonBg: "bg-primary hover:bg-blue-600 shadow-md shadow-blue-200",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      buttonBg: "bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-200",
    },
  };

  const style = variantStyles[variant];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Overlay - Ensuring total coverage with no gaps */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-[90vw] sm:max-w-sm w-full animate-in zoom-in-95 duration-200 border border-gray-100 p-6 m-4">
        <div className="flex flex-col items-center text-center">
          {Icon && (
            <div
              className={`p-3 rounded-full ${style.iconBg} ${style.iconColor} mb-4`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}

          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            {title}
          </h3>

          <div className="text-gray-500 text-sm mb-6 leading-relaxed">
            {description}
          </div>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isConfirmLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isConfirmLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl ${style.buttonBg} text-white font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isConfirmLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
