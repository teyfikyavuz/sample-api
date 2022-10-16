import Redirect from "../entities/Redirect"

export default interface RedirectRepository {
    Find(code: string): Promise<Redirect>
    Store(redirect: Redirect): Promise<Redirect>
}