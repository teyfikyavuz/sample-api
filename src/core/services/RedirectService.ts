import Redirect from "../entities/Redirect"
import RedirectRepository from "../repositories/RedirectRepository"

export class ErrRedirectNotFound extends Error {
    constructor() {
        super("Redirect not found.")
    }
}

export class ErrRedirectInvalidURL extends Error {
    constructor() {
        super("Invalid redirect url.")
    }
}

export default class RedirectService {
    private redirectRepository: RedirectRepository

    constructor(redirectRepository: RedirectRepository) {
        this.redirectRepository = redirectRepository
    }
    
    public async Find(code: string): Promise<Redirect> {
        const redirect = await this.redirectRepository.Find(code)
        if (!redirect)
            throw new ErrRedirectNotFound()

        return redirect
    }

    public async Store(url: string): Promise<Redirect> {
        if (!url || url === "")
            throw new ErrRedirectInvalidURL()

        const redirect: Redirect = {
            Url: url,
            Code: (Math.random() + 1).toString(36).substring(7),
            CreatedAt: new Date
        }

        return await this.redirectRepository.Store(redirect)
    }

}