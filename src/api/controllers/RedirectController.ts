import { Router, Request, Response } from "express";
import RedirectService from "../../core/services/RedirectService"

export default class RedirectController {
    private redirectService: RedirectService
    public router: Router

    constructor(redirectService: RedirectService, router: Router) {
        this.redirectService = redirectService
        this.router = router

        // Define Routes
        this.router.get("/:code", this.Find.bind(this))
        this.router.post("/", this.Store.bind(this))
    }

    private async Find(req: Request, res: Response): Promise<Response> {
        const { code } = req.params

        try {
            const redirect = await this.redirectService.Find(code)
            return res.status(200).send(redirect)
        } catch (error) {
            console.error(error)
            return res.status(500).send(error)
        }
    }

    private async Store(req: Request, res: Response): Promise<Response> {
        const { url } = req.body

        try {
            const redirect = await this.redirectService.Store(url)
            return res.status(201).send(redirect)
        } catch (error) {
            console.error(error)
            return res.status(500).send(error)
        }
    }

}