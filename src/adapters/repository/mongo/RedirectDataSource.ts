import Redirect from "../../../domain/entities/Redirect"
import RedirectRepository from "../../../domain/ports/RedirectRepository"
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

        return { ...redirectMongo } as Redirect
    }

    async Store(redirect: Redirect): Promise<Redirect> {
        const redirectMongo = new RedirectMongo({
            ...redirect,
            isDeleted: false
        })

        await redirectMongo.save()
        return redirect
    }   
}