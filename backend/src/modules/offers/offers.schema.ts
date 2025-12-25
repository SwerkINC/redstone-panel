import { queryParamsSchema } from '@/utils';

import { z } from 'zod';

export const getAllOffersSchema = queryParamsSchema.extend({});

export type GetAllOffersSchema = z.infer<typeof getAllOffersSchema>;
