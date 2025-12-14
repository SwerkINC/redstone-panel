import { type InputHTMLAttributes, forwardRef, useId } from 'react';

/**
 * Input variant
 */
export type InputVariant = 'default' | 'gray' | 'underline' | 'floating';

/**
 * Input size
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input validation
 */
export type InputValidation = 'default' | 'error' | 'success';

/**
 * Input props
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

/**
 * Input component
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            hiddenLabel = false,
            helperText,
            inlineHelper = false,
            cornerHint,
            variant = 'default',
            size = 'md',
            validation = 'default',
            pill = false,
            wrapperClassName = '',
            className = '',
            id,
            disabled,
            readOnly,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        const baseClasses =
            'block w-full border focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

        const sizeClasses = {
            sm: 'py-2 px-3 text-sm',
            md: 'py-3 px-4 text-sm',
            lg: 'py-3 px-4 text-base',
        };

        const variantClasses = {
            default: 'border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500',
            gray: 'bg-gray-50 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500',
            underline:
                'border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-blue-600 focus:ring-0',
            floating: 'border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 peer',
        };

        const validationClasses = {
            default: '',
            error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
        };

        const pillClasses = pill ? 'rounded-full' : '';

        const inputClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${validationClasses[validation]}
      ${pillClasses}
      ${className}
    `
            .trim()
            .replace(/\s+/g, ' ');

        const helperTextClasses = {
            default: 'text-gray-500',
            error: 'text-red-600',
            success: 'text-green-600',
        };

        if (variant === 'floating') {
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
                                className="peer[:not(:placeholder-shown)]:text-xs peer[:not(:placeholder-shown)]:-translate-y-1.5 peer[:not(:placeholder-shown)]:text-gray-500 pointer-events-none absolute start-0 top-0 h-full truncate border border-transparent p-4 text-sm transition duration-100 ease-in-out peer-focus:-translate-y-1.5 peer-focus:text-xs peer-focus:text-gray-500 peer-disabled:pointer-events-none peer-disabled:opacity-50"
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

        return (
            <div className={wrapperClassName}>
                {label && (
                    <div className="mb-2 flex items-center justify-between">
                        <label
                            htmlFor={inputId}
                            className={`block text-sm font-medium ${
                                hiddenLabel ? 'sr-only' : ''
                            } ${disabled ? 'opacity-50' : ''}`}
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
                            inlineHelper ? 'ml-2 inline-block' : 'mt-2'
                        } text-sm ${helperTextClasses[validation]}`}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

/** Input display name */
Input.displayName = 'Input';

/** Input default export */
export default Input;
