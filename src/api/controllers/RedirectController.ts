import { Router, Request, Response } from "express"
import RedirectService, { ErrRedirectInvalidURL, ErrRedirectNotFound } from "../../core/services/RedirectService"
import Controller from "./Controller"

export default class RedirectController implements Controller {
    private service: RedirectService
    router: Router

    constructor(redirectService: RedirectService, router: Router) {
        this.service = redirectService
        this.router = router

        // Define Routes
        this.router.get("/:code", this.Find.bind(this))
        this.router.post("/", this.Store.bind(this))
    }

    private async Find(req: Request, res: Response): Promise<Response|void> {
        const { code } = req.params

        try {
            const redirect = await this.service.Find(code)
            return res.status(301).redirect(redirect.Url)
        } catch (error) {
            if (error instanceof ErrRedirectNotFound)
                return res.status(404).send({ message: error.message })

            return res.status(500).send((error as Error).message)
        }
    }
    
    private async Store(req: Request, res: Response): Promise<Response> {
        const { url } = req.body

        try {
            const redirect = await this.service.Store(url)
            return res.status(201).send(redirect)
        } catch (error) {
            if (error instanceof ErrRedirectInvalidURL)
                return res.status(400).send({ message: error.message })
            
            return res.status(500).send((error as Error).message)
        }
    }

}