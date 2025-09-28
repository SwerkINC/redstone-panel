import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ServerController = () => import('./controller.js')

router
    .group(() => {
        router.get('/', [ServerController, 'index']).middleware([middleware.auth()])
        router.get('/:id', [ServerController, 'show']).middleware([middleware.auth()])
    })
    .prefix('/servers')
