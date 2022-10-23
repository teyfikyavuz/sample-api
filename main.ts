import dotenv from "dotenv"
import Server from "./src/adapters/rest/Server"

// Dotenv
dotenv.config()

const server = new Server(parseInt(process.env.PORT as string) || 8081)
server.listen()
