import Redirect from "../../core/entities/Redirect"
import RedirectRepository from "../../core/repositories/RedirectRepository"
import Connection from "./models/Connection"
import RedirectMongo from "./models/Redirect"

export default class RedirectDataSource implements RedirectRepository {

    constructor() {
        new Connection()
    }

    async Find(code: string): Promise<Redirect | null> {
        const redirectMongo = await RedirectMongo.findOne({ code, isDeleted: false })
        if (!redirectMongo)
            return null

        return {
            Code: redirectMongo.code,
            Url: redirectMongo.url,
            CreatedAt: redirectMongo.createdAt
        } as Redirect
    }

    async Store(redirect: Redirect): Promise<Redirect> {
        const redirectMongo = new RedirectMongo({
            isDeleted: false,
            code: redirect.Code,
            url: redirect.Url,
            createdAt: redirect.CreatedAt
        })
        await redirectMongo.save()

        return redirect
    }
    
}