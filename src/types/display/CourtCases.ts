import CourtCase from "services/entities/CourtCase"
import { DisplayNote } from "./Notes"
import { DisplayTrigger } from "./Triggers"

type FieldsForDisplayPartialCourtCase =
  | "asn"
  | "courtName"
  | "errorId"
  | "errorLockedByUsername"
  | "errorStatus"
  | "errorReport"
  | "isUrgent"
  | "ptiurn"
  | "triggerLockedByUsername"
  | "triggerCount"
  | "triggerStatus"
  | "defendantName"

export type DisplayPartialCourtCase = Pick<CourtCase, FieldsForDisplayPartialCourtCase> & {
  courtDate?: string
  errorLockedByUserFullName?: string
  triggerLockedByUserFullName?: string
  notes: DisplayNote[]
  triggers: DisplayTrigger[]
  resolutionTimestamp: string | null
}

type FieldsForDisplayFullCourtCase =
  | FieldsForDisplayPartialCourtCase
  | "orgForPoliceFilter"
  | "courtCode"
  | "courtReference"

export type DisplayFullCourtCase = Pick<CourtCase, FieldsForDisplayFullCourtCase> & {
  courtDate?: string
  errorLockedByUserFullName?: string
  triggerLockedByUserFullName?: string
  notes: DisplayNote[]
  triggers: DisplayTrigger[]
  resolutionTimestamp: string | null
  phase?: number | null
}
