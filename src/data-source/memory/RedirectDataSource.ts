import Redirect from "../../core/entities/Redirect";
import RedirectRepository from "../../core/repositories/RedirectRepository"

// Sample model
interface RedirectData {
    isActive: boolean
    code: string
    url: string
    createdAt: Date
}

export default class RedirectDataSource implements RedirectRepository {

    private redirects: RedirectData[] = []

    Find(code: string): Promise<Redirect|null> {
        return new Promise((resolve, reject) => {
            const findedRedirect = this.redirects.find(x => x.code === code)
            if (!findedRedirect)
                return resolve(null)
                
            const redirect: Redirect = {
                Code: findedRedirect.code,
                Url: findedRedirect.url,
                CreatedAt: findedRedirect.createdAt
            }

            return resolve(redirect)
        })
    }

    Store(redirect: Redirect): Promise<Redirect> {
        return new Promise((resolve, reject) => {
            const redirectData: RedirectData = {
                isActive: true,
                code: redirect.Code,
                url: redirect.Url,
                createdAt: redirect.CreatedAt
            }

            this.redirects.push(redirectData)

            return resolve(redirect)
        })
    }
}