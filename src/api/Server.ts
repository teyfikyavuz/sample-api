import express, { Router } from "express"
import RedirectService from "../core/services/RedirectService"
import RedirectDataSource from "../data-source/memory/RedirectDataSource"
import RedirectController from "./controllers/RedirectController"

export default class Server {
    private express: express.Express;
    private port: number

    constructor(port: number) {
        this.port = port
        this.express = express()

        // Config
        this.express.use(express.json())

        // Controller
        this.initializeControllers()
    }

    public listen() {
        this.express.listen(this.port, () => {
            console.log("Server is running on port: %d 🚀", this.port)
        })
    }

    private initializeControllers() {
        const redirectRepository = new RedirectDataSource()
        const redirectService = new RedirectService(redirectRepository)
        const redirectController = new RedirectController(redirectService, Router())
        
        this.express.use("/v1", redirectController.router)
    }

}