import express, { Router, Request, Response } from "express"
import helmet from "helmet"
import StatusCode from "./StatusCode"
import IRedirectService from "../../domain/services/interfaces/IRedirectService"
import RedirectController from "./controllers/RedirectController"

export default class ApiServer {
    private express: express.Express
    private readonly port: number
    private readonly username: string
    private readonly password: string

    // Services
    private redirectService: IRedirectService

    constructor(port: number, username: string, password: string, redirectService: IRedirectService) {
        this.express = express()
        this.port = port
        this.username = username
        this.password = password

        // Services
        this.redirectService = redirectService

        // Config
        this.config()
        this.healthcheck()

        // Basic Auth
        this.authentication()

        // Controller
        this.initializeControllers()

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

    private healthcheck(): void {
        this.express.use("/healthcheck", async (res: Response) => {
            const healthcheck = {
                uptime: process.uptime(),
                timestamp: Date.now(),
                message: "OK"
            }

            try {
                return res.send(healthcheck)
            } catch (error) {
                healthcheck.message = (error as Error).message
                return res.status(StatusCode.ServerErrorServiceUnavailable).send(healthcheck)
            }
        })
    }

    private handlers(): void {
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

    private authentication(): void {
        this.express.use((req: Request, res: Response, next) => {
            const authHeader = req.headers.authorization
            if (!authHeader) {
                res.setHeader("WWW-Authenticate", "Basic")
                return res.status(StatusCode.ClientErrorUnauthorized).send({ message: "You are not authenticated!" })
            }

            const auth = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":")
            const username = auth[0]
            const password = auth[1]

            if (username === this.username && password === this.password)
                next()
            else {
                res.setHeader("WWW-Authenticate", "Basic")
                return res.status(StatusCode.ClientErrorUnauthorized).send({ message: "You are not authenticated!" })
            }
        })
    }

    private initializeControllers(): void {
        // Import controllers
        const redirectController = new RedirectController(this.redirectService, Router())

        this.express.use("/api/v1/redirect", redirectController.router)
    }

}