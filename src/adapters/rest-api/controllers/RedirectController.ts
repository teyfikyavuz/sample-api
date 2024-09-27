import { Router, Request, Response } from "express"
import { ErrRedirectExpired, ErrRedirectInvalidURL, ErrRedirectNotFound } from "../../../domain/services/RedirectService"
import StatusCode from "../StatusCode"
import Controller from "./Controller"
import IRedirectService from "../../../domain/services/interfaces/IRedirectService"

export default class RedirectController implements Controller {
    private service: IRedirectService
    router: Router

    constructor(redirectService: IRedirectService, router: Router) {
        this.service = redirectService
        this.router = router

        // Define Routes
        this.router.get("/:code", this.Find.bind(this))
        this.router.get("/", this.FindAll.bind(this))
        this.router.post("/", this.Store.bind(this))
        this.router.delete("/:code", this.Delete.bind(this))
    }

    private async Find(req: Request, res: Response): Promise<Response|void> {
        const { code } = req.params

        try {
            const redirect = await this.service.Find(code)
            return res.status(StatusCode.SuccessOK).send(redirect)
        } catch (error) {
            if (error instanceof ErrRedirectNotFound)
                return res.status(StatusCode.ClientErrorNotFound).send({ message: error.message })

            return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
        }
    }

    private async FindAll(req: Request, res: Response): Promise<Response> {
        const { cursor } = req.query

        try {
            const redirects = await this.service.FindAll(cursor as string)
            return res.status(StatusCode.SuccessOK).send(redirects)
        } catch (error) {
            return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
        }
    }
    
    private async Store(req: Request, res: Response): Promise<Response> {
        const { url, codeSize, expiresAt } = req.body

        try {
            const redirect = await this.service.Store(url, codeSize, new Date(expiresAt))
            return res.status(StatusCode.SuccessCreated).send(redirect)
        } catch (error) {
            if (error instanceof ErrRedirectInvalidURL)
                return res.status(StatusCode.ClientErrorBadRequest).send({ message: error.message })
            
            return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
        }
    }

    private async Delete(req: Request, res: Response): Promise<Response> {
        const { code } = req.params

        try {
            await this.service.Delete(code)
            return res.status(StatusCode.SuccessNoContent).send()
        } catch (error) {
            if (error instanceof ErrRedirectNotFound)
                return res.status(StatusCode.ClientErrorNotFound).send({ message: error.message })

            return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
        }
    }

}