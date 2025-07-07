import { forwardRef, type ComponentProps } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { cn } from "../../../app/utils/cn";

interface SelectProps extends ComponentProps<"select"> {
  name: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, id, error, className, options, ...props }, ref) => {
    const selectId = id ?? name;

    return (
      <div className="relative">
        <select
          {...props}
          ref={ref}
          name={name}
          id={selectId}
          className={cn(
            "bg-white w-full rounded-lg border border-gray-500 px-3 h-[52px] text-gray-800 pt-4 peer focus:border-gray-800 transition-all outline-none appearance-none",
            error && "!border-red-900",
            className
          )}
        >
          <option value="" className="text-gray-500">
            Selecione uma opção
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-800">
              {option.label}
            </option>
          ))}
        </select>

        {/* Ícone de seta personalizado */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {error && (
          <div className="flex gap-2 items-center mt-2 text-red-900">
            <CrossCircledIcon />
            <span className="text-xs">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select"; 