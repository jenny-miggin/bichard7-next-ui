import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import getOffenceCode from "utils/getOffenceCode"

interface Props {
  offence: Offence
}

export const OffenceMatcher = ({ offence }: Props) => {
  const {
    aho: { PncQuery: pncQuery }
  } = useCourtCase()

  const offenceCode = getOffenceCode(offence)

  // TODO: prevent matching twice
  // TODO: match dates
  return (
    <select className="govuk-select">
      <option disabled selected hidden></option>
      {pncQuery?.courtCases?.map((c) => {
        return (
          <optgroup key={c.courtCaseReference} label={c.courtCaseReference}>
            {c.offences
              .filter((o) => o.offence.cjsOffenceCode === offenceCode)
              .map((o) => {
                return (
                  <option key={o.offence.cjsOffenceCode} value={o.offence.sequenceNumber}>
                    {`${String(o.offence.sequenceNumber).padStart(3, "0")} - ${o.offence.cjsOffenceCode}`}
                  </option>
                )
              })}
          </optgroup>
        )
      })}
      <option value="added-in-court">{"Added in court"}</option>
    </select>
  )
}
