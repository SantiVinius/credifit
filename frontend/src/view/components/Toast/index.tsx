import { useEffect, useState } from "react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { cn } from "../../../app/utils/cn";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={cn(
          "flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300",
          type === "success"
            ? "bg-green-100 border border-green-200 text-green-800"
            : "bg-red-100 border border-red-200 text-red-800"
        )}
      >
        {type === "success" ? (
          <CheckCircledIcon className="w-5 h-5" />
        ) : (
          <CrossCircledIcon className="w-5 h-5" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
} 