import Redirect from "../entities/Redirect"

export default interface IRedirectRepository {
    Find(code: string): Promise<Redirect | null>
    FindAll(cursor?: string): Promise<Redirect[]>
    Store(redirect: Redirect): Promise<void>
    Update(redirect: Redirect): Promise<void>
    Delete(code: string): Promise<void>
}