import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';

/** Card size */
export type CardSize = 'sm' | 'md' | 'lg';

/** Card variant */
export type CardVariant = 'default' | 'bordered' | 'shadow' | 'hover';

/** Card props */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Card size */
    size?: CardSize;
    /** Card variant style */
    variant?: CardVariant;
    /** Card header content */
    header?: ReactNode;
    /** Card footer content */
    footer?: ReactNode;
    /** Image at the top of the card */
    image?: string;
    /** Alt text for the image */
    imageAlt?: string;
    /** Image overlay mode (content over image) */
    imageOverlay?: boolean;
    /** Horizontal layout (image on the side) */
    horizontal?: boolean;
    /** Top border color accent */
    topBorderColor?: string;
    /** Enable hover animation */
    hoverable?: boolean;
    /** Center the body content */
    centered?: boolean;
    /** Make body scrollable with max height */
    scrollable?: boolean;
    /** Max height for scrollable body (default: 300px) */
    maxHeight?: string;
    /** Custom className for the card container */
    className?: string;
    /** Custom className for the body */
    bodyClassName?: string;
    /** Custom className for the header */
    headerClassName?: string;
    /** Custom className for the footer */
    footerClassName?: string;
    /** Custom className for the image */
    imageClassName?: string;
    /** Children content (card body) */
    children?: ReactNode;
}

/** Card component */
const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            size = 'md',
            variant = 'default',
            header,
            footer,
            image,
            imageAlt = '',
            imageOverlay = false,
            horizontal = false,
            topBorderColor,
            hoverable = false,
            centered = false,
            scrollable = false,
            maxHeight = '300px',
            className = '',
            bodyClassName = '',
            headerClassName = '',
            footerClassName = '',
            imageClassName = '',
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses = 'bg-white rounded-lg overflow-hidden';

        const variantClasses = {
            default: 'border border-gray-200',
            bordered: 'border-2 border-gray-300',
            shadow: 'shadow-lg',
            hover: 'border border-gray-200 transition-all hover:shadow-lg',
        };

        const sizeClasses = {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
        };

        const paddingClasses = {
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        };

        const hoverClasses = hoverable
            ? 'transition-transform duration-300 hover:-translate-y-1'
            : '';

        const topBorderStyle = topBorderColor
            ? { borderTop: `4px solid ${topBorderColor}` }
            : undefined;

        const containerClasses = horizontal ? 'flex flex-col sm:flex-row' : 'flex flex-col';

        const imageContainerClasses = horizontal ? 'sm:w-1/3 flex-shrink-0' : 'w-full';

        const contentContainerClasses = horizontal ? 'flex-1' : '';

        const bodyClasses = `
      ${paddingClasses[size]}
      ${centered ? 'text-center' : ''}
      ${scrollable ? 'overflow-y-auto' : ''}
      ${bodyClassName}
    `
            .trim()
            .replace(/\s+/g, ' ');

        const headerClasses = `
      ${paddingClasses[size]}
      border-b border-gray-200
      ${headerClassName}
    `
            .trim()
            .replace(/\s+/g, ' ');

        const footerClasses = `
      ${paddingClasses[size]}
      border-t border-gray-200
      ${footerClassName}
    `
            .trim()
            .replace(/\s+/g, ' ');

        const imageClasses = `
      w-full h-full object-cover
      ${hoverable ? 'transition-transform duration-300 group-hover:scale-105' : ''}
      ${imageClassName}
    `
            .trim()
            .replace(/\s+/g, ' ');

        const cardClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${hoverClasses}
      ${hoverable ? 'group' : ''}
      ${className}
    `
            .trim()
            .replace(/\s+/g, ' ');

        if (imageOverlay && image) {
            return (
                <div ref={ref} className={cardClasses} style={topBorderStyle} {...props}>
                    <div className="relative">
                        <img src={image} alt={imageAlt} className={imageClasses} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-x-0 p-6 text-white">{children}</div>
                    </div>
                </div>
            );
        }

        if (horizontal) {
            return (
                <div ref={ref} className={cardClasses} style={topBorderStyle} {...props}>
                    <div className={containerClasses}>
                        {image && (
                            <div className={imageContainerClasses}>
                                <img
                                    src={image}
                                    alt={imageAlt}
                                    className={imageClasses}
                                    style={{ height: '100%', minHeight: '200px' }}
                                />
                            </div>
                        )}
                        <div className={contentContainerClasses}>
                            {header && <div className={headerClasses}>{header}</div>}
                            <div
                                className={bodyClasses}
                                style={scrollable ? { maxHeight } : undefined}
                            >
                                {children}
                            </div>
                            {footer && <div className={footerClasses}>{footer}</div>}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div ref={ref} className={cardClasses} style={topBorderStyle} {...props}>
                {image && (
                    <div className="overflow-hidden">
                        <img src={image} alt={imageAlt} className={imageClasses} />
                    </div>
                )}
                {header && <div className={headerClasses}>{header}</div>}
                <div className={bodyClasses} style={scrollable ? { maxHeight } : undefined}>
                    {children}
                </div>
                {footer && <div className={footerClasses}>{footer}</div>}
            </div>
        );
    }
);

/** Card display name */
Card.displayName = 'Card';

/** Card default export */
export default Card;
