import Redirect from "../entities/Redirect"
import RedirectRepository from "../repositories/RedirectRepository"

export default class RedirectService {
    private redirectRepository: RedirectRepository

    constructor(redirectRepository: RedirectRepository) {
        this.redirectRepository = redirectRepository
    }
    
    public async Find(code: string): Promise<Redirect> {
        return this.redirectRepository.Find(code)
    }

    public async Store(url: string): Promise<Redirect> {
        if (url === "")
            throw Error("Invalid redirect url")

        const redirect: Redirect = {
            Url: url,
            Code: (Math.random() + 1).toString(36).substring(7),
            CreatedAt: new Date
        }

        return this.redirectRepository.Store(redirect)
    }

}