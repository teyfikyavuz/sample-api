import express, { Router, Request, Response, NextFunction } from "express"
import helmet from "helmet"
import StatusCode from "./StatusCode"
import IRedirectService from "../../domain/services/interfaces/IRedirectService"
import { ErrRedirectExpired, ErrRedirectNotFound } from "../../domain/services/RedirectService"

export default class RedirectServer {
    private express: express.Express
    private readonly port: number

    // Services
    private redirectService: IRedirectService

    constructor(port: number, redirectService: IRedirectService) {
        this.express = express()
        this.port = port

        // Services
        this.redirectService = redirectService

        // Config
        this.config()

        // General handlers
        this.handlers()
    }

    public listen() {
        this.express.listen(this.port, () => {
            console.log("Server is running on port: %d 🚀", this.port)
        })
    }

    private config(): void {
        this.express.use(express.json({ limit: "200mb" }))
        this.express.disable("x-powered-by")
        this.express.set("trust proxy", true)
        
        this.express.use(helmet.contentSecurityPolicy())
        this.express.use(helmet.crossOriginEmbedderPolicy())
        this.express.use(helmet.crossOriginOpenerPolicy())
        this.express.use(helmet.crossOriginResourcePolicy())
        this.express.use(helmet.dnsPrefetchControl())
        this.express.use(helmet.expectCt())
        this.express.use(helmet.frameguard())
        this.express.use(helmet.hidePoweredBy())
        this.express.use(helmet.hsts())
        this.express.use(helmet.ieNoOpen())
        this.express.use(helmet.noSniff())
        this.express.use(helmet.originAgentCluster())
        this.express.use(helmet.permittedCrossDomainPolicies())
        this.express.use(helmet.referrerPolicy())
        this.express.use(helmet.xssFilter())
    }

    private handlers(): void {
        // Redirect 301
        this.express.get("/:code", async (req: Request, res: Response) => {
            try {
                const { code } = req.params
                const redirectUrl = await this.redirectService.Redirect(code)

                return res.redirect(StatusCode.RedirectMovedPermanently, redirectUrl)
            } catch (error) {
                if (error instanceof ErrRedirectNotFound || error instanceof ErrRedirectExpired)
                    return res.status(StatusCode.ClientErrorNotFound).send({ message: error.message })
    
                return res.status(StatusCode.ServerErrorInternal).send((error as Error).message)
            }
        })

        // Custom 404 response
        this.express.use((res: Response) => {
            return res.status(StatusCode.ClientErrorNotFound).send({ message: "Sorry can't find that!" })
        })

        // Custom error handler
        this.express.use((err: Error, _req: Request, res: Response) => {
            console.error(err.stack)
            return res.status(StatusCode.ServerErrorInternal).send({ message: "Something broke!", code: "SERVER_ERROR" })
        })
    }

}