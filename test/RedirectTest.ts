import "mocha"
import RedirectService from "../src/core/services/RedirectService"
import RedirectDataSource from "../src/data-source/memory/RedirectDataSource"

describe("Redirect Tests", () => {
    it("Store", async () => {
        const redirectRepository = new RedirectDataSource()
        const redirectService = new RedirectService(redirectRepository)

        await redirectService.Store("http://project418.com")
    })

    it("Find", async () => {
        const redirectRepository = new RedirectDataSource()
        const redirectService = new RedirectService(redirectRepository)

        await redirectService.Find("1w3ne")
    })
    
})