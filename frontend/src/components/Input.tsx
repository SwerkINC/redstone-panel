import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

export type InputVariant = "default" | "gray" | "underline" | "floating";
export type InputSize = "sm" | "md" | "lg";
export type InputValidation = "default" | "error" | "success";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Label text for the input */
  label?: string;
  /** Hide label visually but keep it accessible for screen readers */
  hiddenLabel?: boolean;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Display helper text inline instead of below */
  inlineHelper?: boolean;
  /** Corner hint text displayed in top-right of label */
  cornerHint?: string;
  /** Input variant style */
  variant?: InputVariant;
  /** Input size */
  size?: InputSize;
  /** Validation state */
  validation?: InputValidation;
  /** Make input pill-shaped (fully rounded) */
  pill?: boolean;
  /** Custom className for the wrapper div */
  wrapperClassName?: string;
  /** Custom className for the input element */
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hiddenLabel = false,
      helperText,
      inlineHelper = false,
      cornerHint,
      variant = "default",
      size = "md",
      validation = "default",
      pill = false,
      wrapperClassName = "",
      className = "",
      id,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const generatedId = useId();
    const inputId = id || generatedId;

    // Base input classes
    const baseClasses =
      "block w-full border focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    // Size classes
    const sizeClasses = {
      sm: "py-2 px-3 text-sm",
      md: "py-3 px-4 text-sm",
      lg: "py-3 px-4 text-base",
    };

    // Variant classes
    const variantClasses = {
      default:
        "border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500",
      gray: "bg-gray-50 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500",
      underline:
        "border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0",
      floating:
        "border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 peer",
    };

    // Validation classes
    const validationClasses = {
      default: "",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500",
    };

    // Pill shape
    const pillClasses = pill ? "rounded-full" : "";

    // Combine all classes
    const inputClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${validationClasses[validation]}
      ${pillClasses}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    // Helper text color based on validation
    const helperTextClasses = {
      default: "text-gray-500",
      error: "text-red-600",
      success: "text-green-600",
    };

    // Render floating label variant
    if (variant === "floating") {
      return (
        <div className={wrapperClassName}>
          <div className="relative">
            <input
              ref={ref}
              id={inputId}
              className={inputClasses}
              placeholder=" "
              disabled={disabled}
              readOnly={readOnly}
              {...props}
            />
            {label && (
              <label
                htmlFor={inputId}
                className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
                  peer-focus:text-xs
                  peer-focus:-translate-y-1.5
                  peer-focus:text-gray-500
                  peer[:not(:placeholder-shown)]:text-xs
                  peer[:not(:placeholder-shown)]:-translate-y-1.5
                  peer[:not(:placeholder-shown)]:text-gray-500"
              >
                {label}
              </label>
            )}
          </div>
          {helperText && (
            <p className={`mt-2 text-sm ${helperTextClasses[validation]}`}>
              {helperText}
            </p>
          )}
        </div>
      );
    }

    // Render standard variants
    return (
      <div className={wrapperClassName}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor={inputId}
              className={`block text-sm font-medium ${
                hiddenLabel ? "sr-only" : ""
              } ${disabled ? "opacity-50" : ""}`}
            >
              {label}
            </label>
            {cornerHint && !hiddenLabel && (
              <span className="text-sm text-gray-500">{cornerHint}</span>
            )}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />

        {helperText && (
          <p
            className={`${
              inlineHelper ? "inline-block ml-2" : "mt-2"
            } text-sm ${helperTextClasses[validation]}`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
