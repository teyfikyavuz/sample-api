export default interface Redirect {
    code: string
    url: string
    codeSize: number
    shortUrl: string
    redirectCount: number
    expiresAt: Date
    createdAt: Date
}

export interface RedirectWithPagination {
    data: Redirect[]
    cursor?: string | null
}