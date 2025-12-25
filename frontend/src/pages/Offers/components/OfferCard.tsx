import type { Offer } from '@/types';

import { ArchiveBoxIcon, Cpu, Memory, StarIcon } from '@phosphor-icons/react';

import { Card } from '@/components';

/**
 * Render the price with its billing cycle.
 * @param price - Offer price in whole currency units.
 * @param billingCycle - Billing cycle descriptor.
 * @returns JSX element for formatted price.
 */
function renderPrice(price: number, billingCycle: Offer['billingCycle']) {
    return (
        <span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {price === 0 ? 'Free' : `${price} €`}
            </span>
            {price !== 0 && (
                <span className="ml-1 text-base text-gray-500 dark:text-gray-300">
                    / {billingCycle?.toLowerCase()}
                </span>
            )}
        </span>
    );
}

/**
 * Renders a configuration item row.
 * @param label - Display label.
 * @param value - Value to display.
 * @param Icon - Optional icon to render.
 * @returns JSX element for config row.
 */
function renderConfigItem(label: string, value: string, Icon?: React.ElementType) {
    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon className="size-5 text-blue-500" />}
            <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
            <span className="ml-auto font-mono text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}

/**
 * Offer card.
 */
export default function OfferCard({
    name,
    price,
    memoryLimit,
    cpuLimit,
    storageLimit,
    type,
    billingCycle,
    mostPopular,
}: Offer) {
    return (
        <div className="relative">
            <Card
                className={`border transition-shadow duration-200 hover:shadow-xl ${
                    mostPopular ? 'ring-2 ring-blue-500' : ''
                }`}
            >
                {mostPopular && (
                    <div className="absolute -right-2 -top-2 flex items-center gap-2 rounded-bl-lg rounded-tr-lg bg-blue-500 px-3 py-1 shadow-lg">
                        <StarIcon className="size-5 text-white" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase text-white">
                            Most Popular
                        </span>
                    </div>
                )}

                <div className="flex flex-col items-center justify-center gap-2 pb-4 pt-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
                    <div>{renderPrice(price, billingCycle)}</div>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold uppercase text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                        {type}
                    </span>
                </div>

                <div className="mb-2 border-b border-gray-200" />

                <div className="space-y-3 py-2">
                    {renderConfigItem('Memory', `${memoryLimit} MB`, Memory)}
                    {renderConfigItem('CPU', `${cpuLimit} core${cpuLimit > 1 ? 's' : ''}`, Cpu)}
                    {renderConfigItem('Storage', `${storageLimit} MB`, ArchiveBoxIcon)}
                </div>
            </Card>
        </div>
    );
}
