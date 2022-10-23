import Redirect from "../entities/Redirect"

export default interface RedirectRepository {
    Find(code: string): Promise<Redirect | null>
    Store(redirect: Redirect): Promise<Redirect>
}