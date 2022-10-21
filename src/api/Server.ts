import express, { Router, Request, Response } from "express"
import helmet from "helmet"
import RedirectService from "../core/services/RedirectService"
import RedirectDataSource from "../data-source/memory/RedirectDataSource"
import RedirectController from "./controllers/RedirectController"
import StatusCode from "./StatusCode"

export default class Server {
    private express: express.Express
    private port: number

    constructor(port: number) {
        this.port = port
        this.express = express()

        // Config
        this.config()
        this.handlers()

        // Controller
        this.initializeControllers()
    }

    public listen() {
        this.express.listen(this.port, () => {
            console.log("Server is running on port: %d 🚀", this.port)
        })
    }

    private config(): void {
        this.express.use(express.json())
        this.express.disable("x-powered-by")
        
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
        // Healthcheck
        this.express.use("/healthcheck", async (req: Request, res: Response) => {
            const healthcheck = {
                uptime: process.uptime(),
                message: "OK",
                timestamp: Date.now()
            }

            try {
                return res.send(healthcheck)
            } catch (error) {
                healthcheck.message = (error as Error).message
                return res.status(StatusCode.ServerErrorServiceUnavailable).send(healthcheck)
            }
        })
        
        // Custom 404 response
        this.express.use((req: Request, res: Response) => {
            return res.status(StatusCode.ClientErrorNotFound).send({ message: "Sorry can't find that!" })
        })

        // Custom error handler
        this.express.use((err: Error, req: Request, res: Response) => {
            console.error(err.stack)
            res.status(StatusCode.ServerErrorInternal).send({ message: "Something broke!" })
        })
    }

    private initializeControllers(): void {
        const redirectRepository = new RedirectDataSource()
        const redirectService = new RedirectService(redirectRepository)
        const redirectController = new RedirectController(redirectService, Router())

        this.express.use("/v1", redirectController.router)
    }

}