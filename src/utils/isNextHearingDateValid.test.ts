import { Amendments } from "../types/Amendments"
import isNextHearingDateValid from "./isNextHearingDateAmended"
import createDummyAho from "../../test/helpers/createDummyAho"
import HO100102 from "../../test/helpers/exceptions/HO100102"
import HO100323 from "../../test/helpers/exceptions/HO100323"

describe("nextHearingDateValidationError", () => {
  const dummyAho = createDummyAho()

  it("should return false if next hearing date editable field is empty", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: ""
        }
      ]
    }
    const result = isNextHearingDateValid(dummyAho.Exceptions, amendments.nextHearingDate)

    expect(result).toBe(false)
  })

  it("should return true if a value is entered into the next hearing date editable field", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2025-02-10"
        }
      ]
    }

    const result = isNextHearingDateValid(dummyAho.Exceptions, amendments.nextHearingDate)

    expect(result).toBe(true)
  })

  it("should return false if one of the next hearing location editable fields remained empty", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2025-02-10"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: ""
        }
      ]
    }

    const result = isNextHearingDateValid(dummyAho.Exceptions, amendments.nextHearingDate)

    expect(result).toBe(false)
  })

  it("should return true if multiple hearing date editable fields have values", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2025-01-10"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2026-05-10"
        }
      ]
    }

    const result = isNextHearingDateValid(dummyAho.Exceptions, amendments.nextHearingDate)

    expect(result).toBe(true)
  })
})
