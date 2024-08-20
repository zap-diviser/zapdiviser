import React from "react";
import { cn } from "../utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ className, name, label, required, error, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={name}
          className={cn(
            "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
            error && "text-red-600 dark:text-red-500",
          )}
        >
          {label}
          {required && <span className="text-red-500 font-bold">{" *"}</span>}
        </label>
        <input
          ref={ref}
          name={name}
          required={required}
          {...props}
          className={cn(
            "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            className,
            error &&
              "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500",
          )}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

export default Input;
