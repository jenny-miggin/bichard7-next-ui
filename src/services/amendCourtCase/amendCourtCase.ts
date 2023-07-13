import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/dist/parse/parseAhoXml/parseAhoXml"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/dist/serialise/ahoXml/generate"
import Phase from "@moj-bichard7-developers/bichard7-next-core/dist/types/Phase"
import updateCourtCaseAho from "services/updateCourtCaseAho"
import { DataSource, EntityManager } from "typeorm"
import { Amendments } from "types/Amendments"
import { isError } from "types/Result"
import createForceOwner from "utils/createForceOwner"
import applyAmendmentsToAho from "./applyAmendmentsToAho"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import type User from "../entities/User"
import insertNotes from "services/insertNotes"
import getSystemNotes from "utils/amendments/getSystemNotes"
import CourtCase from "../entities/CourtCase"

const amendCourtCase = async (
  dataSource: DataSource | EntityManager,
  amendments: Partial<Amendments>,
  courtCase: CourtCase,
  userDetails: User
): Promise<AnnotatedHearingOutcome | Error> => {
  if (
    (courtCase.errorLockedByUsername && courtCase.errorLockedByUsername != userDetails.username) ||
    (courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername != userDetails.username)
  ) {
    return new Error("Court case is locked by another user")
  }

  // we need to parse the annotated message due to being xml in db
  const aho = parseAhoXml(courtCase.updatedHearingOutcome ?? courtCase.hearingOutcome)

  if (isError(aho)) {
    return aho
  }

  const ahoForceOwner = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner
  if (ahoForceOwner === undefined || !ahoForceOwner.OrganisationUnitCode) {
    const organisationUnitCodes = createForceOwner(courtCase.orgForPoliceFilter || "")

    if (isError(organisationUnitCodes)) {
      return organisationUnitCodes
    }
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = organisationUnitCodes
  }
  const updatedAho = applyAmendmentsToAho(amendments, aho)

  if (isError(updatedAho)) {
    return updatedAho
  }

  const generatedXml = convertAhoToXml(updatedAho, false)

  // Depending on the phase, treat the update as either hoUpdate or pncUpdate
  if (courtCase.phase === Phase.HEARING_OUTCOME) {
    if (courtCase.errorLockedByUsername === userDetails.username || courtCase.errorLockedByUsername === null) {
      const updateResult = await updateCourtCaseAho(
        dataSource,
        courtCase.errorId,
        generatedXml,
        !amendments.noUpdatesResubmit
      )

      if (isError(updateResult)) {
        return updateResult
      }

      const addNoteResult = await insertNotes(dataSource, getSystemNotes(amendments, userDetails, courtCase.errorId))

      if (isError(addNoteResult)) {
        return addNoteResult
      }
    }
  } else {
    // TODO: Cover PNC update phase
  }

  return updatedAho
}

export default amendCourtCase
