import Redirect, { RedirectWithPagination } from "../../entities/Redirect"

export default interface IRedirectService {
    Find(code: string): Promise<Redirect>
    FindAll(cursor?: string): Promise<RedirectWithPagination>
    Redirect(code: string): Promise<string>
    Store(url: string, codeSize: number, expiresAt: Date): Promise<Redirect>
    Delete(code: string): Promise<void>
    IncrementRedirectCount(redirect: Redirect): Promise<void>
}