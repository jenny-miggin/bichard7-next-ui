import { defaultSetup, loginAndGoToUrl } from "../support/helpers"

describe("Case list", () => {
  before(() => {
    defaultSetup()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })

  it("should respond with forbidden response code when CSRF tokens are invalid", () => {
    loginAndGoToUrl()
    cy.checkCsrf("/bichard")
    cy.checkCsrf("/bichard/court-cases/0")
    cy.checkCsrf("/bichard/court-cases/0/reallocate")
    cy.checkCsrf("/bichard/court-cases/0/resolve")
    cy.checkCsrf("/bichard/switching-feedback?redirectTo=..%2Fbichard-ui%2FRefreshListNoRedirect")
    cy.checkCsrf("/bichard/feedback?previousPath=/")
  })
})
