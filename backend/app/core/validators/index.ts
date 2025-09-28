import vine from '@vinejs/vine'

export const paginationValidator = vine.compile(
    vine.object({
        limit: vine.number().min(1).max(100),
        page: vine.number().min(1),
        search: vine.string().optional(),
    })
)

export const idValidator = vine.compile(
    vine.object({
        id: vine.number().min(1),
    })
)
