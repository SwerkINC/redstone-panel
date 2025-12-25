import { useQuery } from '@tanstack/react-query';

import { OfferCard } from './components';
import { Error, Layout, Loader } from '@/components';

import { offersService } from '@/services';

/**
 * Offers page
 */
export function Offers() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['offers'],
        queryFn: async () => {
            const response = await offersService.getAllOffers();
            return response.data;
        },
    });

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <Error code="500" message={error.message} />;
    }

    return (
        <Layout title="Offers">
            <div className="mx-auto w-full max-w-7xl">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data && data.length > 0 ? (
                        data.map((offer) => <OfferCard key={offer.id} {...offer} />)
                    ) : (
                        <div className="flex flex-row items-center justify-center gap-4">
                            <p className="text-gray-600 dark:text-gray-400">Aucune offre trouvée</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
