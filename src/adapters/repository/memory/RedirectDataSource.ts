import Redirect from "../../../domain/entities/Redirect"
import RedirectRepository from "../../../domain/ports/RedirectRepository"

// Sample model
interface RedirectData {
    isActive: boolean
    code: string
    url: string
    createdAt: Date
}

export default class RedirectDataSource implements RedirectRepository {

    private redirects: RedirectData[] = []

    Find(code: string): Promise<Redirect | null> {
        return new Promise((resolve, reject) => {
            const findedRedirect = this.redirects.find(x => x.code === code)
            if (!findedRedirect)
                return resolve(null)
                
            const redirect: Redirect = { ...findedRedirect }
            return resolve(redirect)
        })
    }

    Store(redirect: Redirect): Promise<Redirect> {
        return new Promise((resolve, reject) => {
            const redirectData: RedirectData = {
                ...redirect,
                isActive: false
            }

            this.redirects.push(redirectData)
            return resolve(redirect)
        })
    }
}