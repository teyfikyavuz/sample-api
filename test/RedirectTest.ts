import "mocha"
import dotenv from "dotenv"
import RedirectService from "../src/domain/services/RedirectService"
import RedirectDataSource from "../src/adapters/repository/mongo/RedirectDataSource"

// Dotenv
dotenv.config()

// Redirect service
const redirectRepository = new RedirectDataSource()
const redirectService = new RedirectService(redirectRepository)

describe("Redirect Tests", () => {
    it("Store", async () => {
        await redirectService.Store("http://project418.com")
    })

    it("Find", async () => {
        const stored = await redirectService.Store("http://project418.com")
        await redirectService.Find(stored.code)
    })
    
})