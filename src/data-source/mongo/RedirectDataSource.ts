import Redirect from "../../core/entities/Redirect"
import RedirectRepository from "../../core/repositories/RedirectRepository"

export default class RedirectDataSource implements RedirectRepository {
    Find(code: string): Promise<Redirect | null> {
        throw new Error("Method not implemented.")
    }
    Store(redirect: Redirect): Promise<Redirect> {
        throw new Error("Method not implemented.")
    }
    
}