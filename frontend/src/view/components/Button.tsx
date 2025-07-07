import { cn } from "../../app/utils/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label"?: string;
}

export function Button({ className, "aria-label": ariaLabel, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      className={cn(
        "bg-teal-900 hover:bg-teal-800 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 px-6 h-12 rounded-2xl font-medium text-white transition-all",
        className
      )}
    />
  );
}
