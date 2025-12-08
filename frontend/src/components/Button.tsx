import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant =
  | "solid"
  | "outline"
  | "ghost"
  | "soft"
  | "white"
  | "link";
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark";
export type ButtonSize = "sm" | "md" | "lg";

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant;
  /** Button color theme */
  color?: ButtonColor;
  /** Button size */
  size?: ButtonSize;
  /** Make button pill-shaped (fully rounded) */
  pill?: boolean;
  /** Make button full width */
  block?: boolean;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to display before text */
  iconBefore?: ReactNode;
  /** Icon to display after text */
  iconAfter?: ReactNode;
  /** Icon-only button (no text) */
  iconOnly?: boolean;
  /** Active state styling */
  active?: boolean;
  /** Children content */
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      color = "primary",
      size = "md",
      pill = false,
      block = false,
      loading = false,
      iconBefore,
      iconAfter,
      iconOnly = false,
      active = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    // Base button classes
    const baseClasses =
      "inline-flex items-center justify-center gap-x-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    // Size classes
    const sizeClasses = {
      sm: iconOnly ? "w-8 h-8 text-sm" : "py-2 px-3 text-sm",
      md: iconOnly ? "w-10 h-10 text-sm" : "py-3 px-4 text-sm",
      lg: iconOnly ? "w-12 h-12 text-base" : "py-3 px-4 text-base",
    };

    // Variant and color combinations
    const variantColorClasses: Record<
      ButtonVariant,
      Record<ButtonColor, string>
    > = {
      solid: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
        secondary:
          "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800",
        success:
          "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
        warning:
          "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 active:bg-yellow-700",
        info: "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 active:bg-cyan-800",
        dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700 active:bg-black",
      },
      outline: {
        primary:
          "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 active:bg-blue-700 active:text-white",
        secondary:
          "border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-500 active:bg-gray-700 active:text-white",
        success:
          "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 active:bg-green-700 active:text-white",
        danger:
          "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 active:bg-red-700 active:text-white",
        warning:
          "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white focus:ring-yellow-500 active:bg-yellow-600 active:text-white",
        info: "border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white focus:ring-cyan-500 active:bg-cyan-700 active:text-white",
        dark: "border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white focus:ring-gray-700 active:bg-gray-900 active:text-white",
      },
      ghost: {
        primary:
          "text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus:ring-blue-500 active:bg-blue-200",
        secondary:
          "text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-500 active:bg-gray-200",
        success:
          "text-green-600 hover:bg-green-100 hover:text-green-700 focus:ring-green-500 active:bg-green-200",
        danger:
          "text-red-600 hover:bg-red-100 hover:text-red-700 focus:ring-red-500 active:bg-red-200",
        warning:
          "text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 focus:ring-yellow-500 active:bg-yellow-200",
        info: "text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 focus:ring-cyan-500 active:bg-cyan-200",
        dark: "text-gray-800 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-700 active:bg-gray-200",
      },
      soft: {
        primary:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500 active:bg-blue-300",
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
        success:
          "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500 active:bg-green-300",
        danger:
          "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500 active:bg-red-300",
        warning:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500 active:bg-yellow-300",
        info: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200 focus:ring-cyan-500 active:bg-cyan-300",
        dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700 active:bg-black",
      },
      white: {
        primary:
          "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-blue-500 active:bg-gray-100",
        secondary:
          "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100",
        success:
          "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-green-500 active:bg-gray-100",
        danger:
          "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-red-500 active:bg-gray-100",
        warning:
          "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-yellow-500 active:bg-gray-100",
        info: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-cyan-500 active:bg-gray-100",
        dark: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-gray-700 active:bg-gray-100",
      },
      link: {
        primary:
          "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500 active:text-blue-800",
        secondary:
          "text-gray-600 hover:text-gray-700 underline-offset-4 hover:underline focus:ring-gray-500 active:text-gray-800",
        success:
          "text-green-600 hover:text-green-700 underline-offset-4 hover:underline focus:ring-green-500 active:text-green-800",
        danger:
          "text-red-600 hover:text-red-700 underline-offset-4 hover:underline focus:ring-red-500 active:text-red-800",
        warning:
          "text-yellow-600 hover:text-yellow-700 underline-offset-4 hover:underline focus:ring-yellow-500 active:text-yellow-800",
        info: "text-cyan-600 hover:text-cyan-700 underline-offset-4 hover:underline focus:ring-cyan-500 active:text-cyan-800",
        dark: "text-gray-800 hover:text-gray-900 underline-offset-4 hover:underline focus:ring-gray-700 active:text-black",
      },
    };

    // Pill shape
    const pillClasses = pill ? "rounded-full" : "";

    // Block button
    const blockClasses = block ? "w-full" : "";

    // Active state
    const activeClasses = active ? "ring-2 ring-offset-2" : "";

    // Combine all classes
    const buttonClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantColorClasses[variant][color]}
      ${pillClasses}
      ${blockClasses}
      ${activeClasses}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && iconBefore && iconBefore}
        {!iconOnly && children}
        {!loading && iconAfter && iconAfter}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
