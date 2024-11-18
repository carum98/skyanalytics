import { ParamsCode } from '@schemas/_params'
import { InsertUserAccountsSchema } from '@schemas/user_accounts.schemas'
import { UserAccountsService } from '@services/user_accounts.service'
import { PaginationSchemaType } from '@utils/pagination'
import { Request, Response } from 'express'

export class UserAccountsController {
    constructor(private service: UserAccountsService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const query = req.query as unknown as PaginationSchemaType & { options?: boolean }

        if (query.options) {
            const data = await this.service.getOptions()
            res.json({ data })
        } else {
            const userAccounts = await this.service.getAll(query)
            res.json(userAccounts)
        }
    }

    get = async (req: Request, res: Response): Promise<void> => {
        const params = req.params as unknown as ParamsCode

        const userAccount = await this.service.get(params.code)
        res.json(userAccount)
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const body = req.body as unknown as InsertUserAccountsSchema

        const userAccount = await this.service.create(body)
        res.json(userAccount)
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const params = req.params as unknown as ParamsCode

        const userAccount = await this.service.update(params.code, req.body)
        res.json(userAccount)
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        const params = req.params as unknown as ParamsCode

        const data = await this.service.delete(params.code)

        if (data) {
            res.status(204).json()
        }
    }

    getOptions = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.getOptions()

        res.json({ data })

        return
    }
}
