import { Router, Request, Response } from "express"
import RedirectService, { ErrRedirectInvalidURL, ErrRedirectNotFound } from "../../../domain/services/RedirectService"
import StatusCode from "../StatusCode"
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
            return res.status(StatusCode.RedirectMovedPermanently).redirect(redirect.url)
        } catch (error) {
            if (error instanceof ErrRedirectNotFound)
                return res.status(StatusCode.ClientErrorNotFound).send({ message: error.message })

            return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
        }
    }
    
    private async Store(req: Request, res: Response): Promise<Response> {
        const { url } = req.body

        try {
            const redirect = await this.service.Store(url)
            return res.status(StatusCode.SuccessCreated).send(redirect)
        } catch (error) {
            if (error instanceof ErrRedirectInvalidURL)
                return res.status(StatusCode.ClientErrorBadRequest).send({ message: error.message })
            
            return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
        }
    }

}