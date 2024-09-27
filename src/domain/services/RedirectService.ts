import Redirect, { RedirectWithPagination } from "../entities/Redirect"
import RedirectRepository from "../ports/IRedirectRepository"
import IRedirectService from "./interfaces/IRedirectService"
import badWords from "../../../badwords.json"

export default class RedirectService implements IRedirectService {
    private readonly HOST = process.env.HOST || ""
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

    public async FindAll(cursor?: string): Promise<RedirectWithPagination> {
        const data = await this.redirectRepository.FindAll(cursor)

        return {
            data,
            cursor: data.length > 0 ? data[data.length - 1].code : null
        }
    }

    public async Redirect(code: string): Promise<string> {
        const redirect = await this.Find(code)
        if (redirect.expiresAt < new Date)
            throw new ErrRedirectExpired()

        await this.IncrementRedirectCount(redirect)

        return redirect.url
    }

    public async Store(url: string, codeSize: number, expiresAt: Date): Promise<Redirect> {
        if (!url || url === "" || new RegExp("^(http|https)://", "i").test(url) === false)
            throw new ErrRedirectInvalidURL()

        const code = await this.GenerateCode(codeSize)
        const redirect: Redirect = {
            url: url,
            code,
            codeSize,
            shortUrl: `${this.HOST}/${code}`,
            redirectCount: 0,
            expiresAt,
            createdAt: new Date
        }

        await this.redirectRepository.Store(redirect)

        return redirect
    }

    public async Delete(code: string): Promise<void> {
        const redirect = await this.redirectRepository.Find(code)
        if (!redirect)
            throw new ErrRedirectNotFound()

        await this.redirectRepository.Delete(code)
    }

    public async IncrementRedirectCount(redirect: Redirect): Promise<void> {
        redirect.redirectCount++
        await this.redirectRepository.Update(redirect)
    }

    private async GenerateCode(size: number): Promise<string> {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    
        let code = ""
        for (let i = 0; i < size; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length)
            code += characters[randomIndex]
        }
    
        // Check if code contains any disallowed words
        for (const word of badWords as string[]) {
            if (code.includes(word))
                return await this.GenerateCode(size)
        }
    
        // Check if code already exists
        const redirect = await this.redirectRepository.Find(code)
        if (redirect)
            return await this.GenerateCode(size);
    
        return code
    }
}

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

export class ErrRedirectExpired extends Error {
    constructor() {
        super("Redirect url expired.")
    }
}