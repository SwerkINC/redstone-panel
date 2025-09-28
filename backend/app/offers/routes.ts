import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'

const OfferController = () => import('./controller.js')

router
    .group(() => {
        router.get('/', [OfferController, 'index'])
        router
            .post('/:offerId/purchase', [OfferController, 'purchase'])
            .middleware([middleware.auth()])
    })
    .prefix('/offers')
