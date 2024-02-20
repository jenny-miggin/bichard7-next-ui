import { CaseState, Reason } from "./CaseListQueryParams"

export type FilterAction =
  | { method: FilterMethod; type: "defendantName"; value: string }
  | { method: FilterMethod; type: "courtName"; value: string }
  | { method: FilterMethod; type: "reasonCode"; value: string }
  | { method: FilterMethod; type: "ptiurn"; value: string }
  | { method: FilterMethod; type: "urgency"; value: boolean }
  | { method: FilterMethod; type: "caseAge"; value: string }
  | { method: "add"; type: "dateFrom"; value: string }
  | { method: "add"; type: "dateTo"; value: string }
  | { method: "remove"; type: "dateRange"; value: string }
  | { method: FilterMethod; type: "locked"; value: boolean }
  | { method: FilterMethod; type: "reason"; value: Reason }
  | { method: FilterMethod; type: "caseState"; value: CaseState }
  | { method: FilterMethod; type: "myCases"; value: boolean }

export type FilterType =
  | "defendantName"
  | "courtName"
  | "reasonCode"
  | "ptiurn"
  | "urgency"
  | "caseAge"
  | "dateFrom"
  | "dateTo"
  | "dateRange"
  | "locked"
  | "reason"
  | "caseState"
  | "myCases"

export type FilterMethod = "add" | "remove"
export type FilterValue = boolean | string | Reason
export type FilterState = "Selected" | "Applied"
export type Filter = {
  urgentFilter: {
    value?: boolean
    state?: FilterState
    label?: string
  }
  caseAgeFilter: {
    value: string
    state: FilterState
  }[]
  dateFrom: {
    value?: string
    state?: FilterState
  }
  dateTo: {
    value?: string
    state?: FilterState
  }
  lockedFilter: {
    value?: boolean
    state?: FilterState
    label?: string
  }
  caseStateFilter: {
    value?: CaseState
    state?: FilterState
    label?: string
  }
  defendantNameSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  courtNameSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  reasonCodes: {
    value?: string
    state?: FilterState
    label?: string
  }[]
  ptiurnSearch: {
    value?: string
    state?: FilterState
    label?: string
  }
  reasonFilter: {
    value: Reason
    state: FilterState
  }[]
  myCasesFilter: {
    value?: boolean
    state?: FilterState
    label?: string
  }
}
