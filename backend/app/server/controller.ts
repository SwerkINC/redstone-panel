import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServerService from './service.js'
import i18nManager from '@adonisjs/i18n/services/main'
import { idValidator, paginationValidator } from '#core/validators/index'

@inject()
export default class ServerController {
    constructor(private serverService: ServerService) {}

    async index(ctx: HttpContext) {
        const { user } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')
        if (!user) {
            return ctx.response.unauthorized({
                message: i18n.t('messages.auth.user_not_authenticated'),
            })
        }
        const { limit, page, search } = await paginationValidator.validate(ctx.request.qs())

        const servers = await this.serverService.findByUser(Number(user.id), {
            limit,
            page,
            search: search || '',
        })
        return ctx.response.ok(servers)
    }

    async show(ctx: HttpContext) {
        const { user } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')
        if (!user) {
            return ctx.response.unauthorized({
                message: i18n.t('messages.auth.user_not_authenticated'),
            })
        }

        const { id } = await idValidator.validate(ctx.request.params())
        if (!id) {
            return ctx.response.badRequest({
                message: i18n.t('messages.validation_errors'),
            })
        }

        const server = await this.serverService.findById(Number(id), Number(user.id))
        return ctx.response.ok(server)
    }
}
