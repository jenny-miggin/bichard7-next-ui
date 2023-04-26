import type CaseDetailsTab from "types/CaseDetailsTab"

export interface ExceptionPathDetailsResult {
  field: string
  location?: string
  displayText: string
  tab?: CaseDetailsTab
  offenceOrderIndex?: number
}

const getExceptionPathDetails = (path: (string | number)[]): ExceptionPathDetailsResult => {
  const offenceIndex = path.findIndex((p) => p === "Offence")
  let tab: CaseDetailsTab | undefined
  let offenceOrderIndex: number | undefined
  let location: string | undefined
  if (offenceIndex > 0) {
    offenceOrderIndex = Number(path[offenceIndex + 1])
    location = `Offence ${offenceOrderIndex + 1}`
    tab = "Offences"
  } else if (path.includes("Case")) {
    location = "Case information"
    tab = "Case information"
  }

  const fieldName = String(path[path.length - 1])
  const fieldNameWords = fieldName.match(/([A-Z]+[a-z]+)/g)
  const formattedFieldName = fieldNameWords
    ? fieldNameWords[0] + fieldNameWords.join(" ").slice(fieldNameWords[0].length).toLowerCase()
    : fieldName

  return {
    field: fieldName,
    location,
    displayText: `${formattedFieldName}${location ? ` (${location})` : ""}`,
    offenceOrderIndex,
    tab
  }
}

export default getExceptionPathDetails
