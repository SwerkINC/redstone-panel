import { cn } from '@/lib';

export default function Layout({
    children,
    title,
    className,
}: {
    children: React.ReactNode;
    title?: string;
    className?: string;
}) {
    return (
        <div className={cn('flex h-screen flex-col bg-gray-50 p-8 dark:bg-gray-900', className)}>
            {title && (
                <h1 className="text-2xl font-bold">
                    <span className="text-blue-600 dark:text-blue-400">
                        {title.charAt(0).toUpperCase()}
                    </span>
                    {title.slice(1)}
                </h1>
            )}
            {children}
        </div>
    );
}
