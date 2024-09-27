import dotenv from "dotenv"
import RedirectDataSource from "./adapters/repository/RedirectDataSource"
import RedirectService from "./domain/services/RedirectService"
import ApiServer from "./adapters/rest-api/Server"
import RedirectServer from "./adapters/redirect/Server"

// Dotenv
dotenv.config()

// Datasource
const redirectDataSource = new RedirectDataSource()

// Service
const redirectService = new RedirectService(redirectDataSource)

// API
const apiPort = process.env.API_PORT ? parseInt(process.env.API_PORT) : 5061
const apiUser = process.env.API_USER ? process.env.API_USER.toString() : "admin"
const apiPassword = process.env.API_PASS ? process.env.API_PASS.toString() : "admin"

const apiServer = new ApiServer(apiPort, apiUser, apiPassword, redirectService)
apiServer.listen()

// REDIRECT
const redirectPort = process.env.REDIRECT_PORT ? parseInt(process.env.REDIRECT_PORT) : 5062
const redirectServer = new RedirectServer(redirectPort, redirectService)
redirectServer.listen()