import { Brackets, DataSource, IsNull, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import { CaseListQueryParams } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import courtCasesByVisibleForcesQuery from "./queries/courtCasesByVisibleForcesQuery"

const listCourtCases = async (
  connection: DataSource,
  {
    pageNum,
    maxPageItems,
    forces,
    orderBy,
    order,
    defendantName,
    courtName,
    ptiurn,
    reasonsFilter: resultFilter,
    urgent,
    courtDateRange,
    locked,
    caseState,
    allocatedToUserName,
    reasonsSearch
  }: CaseListQueryParams
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (pageNum ? parseInt(pageNum, 10) : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? parseInt(maxPageItems, 10) : 25
  const courtCaseRepository = connection.getRepository(CourtCase)
  const query = courtCasesByVisibleForcesQuery(courtCaseRepository, forces)
    .leftJoinAndSelect("courtCase.triggers", "trigger")
    .leftJoinAndSelect("courtCase.notes", "note")
    .skip(pageNumValidated * maxPageItemsValidated)
    .take(maxPageItemsValidated)

  const sortOrder = order === "desc" ? "DESC" : "ASC"
  if (orderBy === "reason") {
    query.orderBy("courtCase.errorReason", sortOrder).addOrderBy("courtCase.triggerReason", sortOrder)
  } else if (orderBy === "lockedBy") {
    query
      .orderBy("courtCase.errorLockedByUsername", sortOrder)
      .addOrderBy("courtCase.triggerLockedByUsername", sortOrder)
  } else {
    const orderByQuery = `courtCase.${orderBy ?? "errorId"}`
    query.orderBy(orderByQuery, sortOrder)
  }

  if (defendantName) {
    query.andWhere("courtCase.defendantName ilike '%' || :name || '%'", {
      name: defendantName
    })
  }

  if (courtName) {
    query.andWhere("courtCase.courtName ilike '%' || :name || '%'", {
      name: courtName
    })
  }

  if (ptiurn) {
    query.andWhere("courtCase.ptiurn ilike '%' || :ptiurn || '%'", {
      ptiurn: ptiurn
    })
  }

  if (reasonsSearch) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where("trigger.trigger_code ilike '%' || :reason || '%'", {
          reason: reasonsSearch
        }).orWhere("courtCase.error_report ilike '%' || :reason || '%'", {
          reason: reasonsSearch
        })
      })
    )
  }

  if (resultFilter?.includes("Triggers")) {
    query.andWhere({ triggerCount: MoreThan(0) })
  } else if (resultFilter?.includes("Exceptions")) {
    query.andWhere({ errorCount: MoreThan(0) })
  }

  if (urgent === "Urgent") {
    query.andWhere({ isUrgent: MoreThan(0) })
  } else if (urgent === "Non-urgent") {
    query.andWhere({ isUrgent: 0 })
  }

  if (courtDateRange) {
    query.andWhere({ courtDate: MoreThanOrEqual(courtDateRange.from) })
    query.andWhere({ courtDate: LessThanOrEqual(courtDateRange.to) })
  }

  if (!caseState) {
    query.andWhere({
      resolutionTimestamp: IsNull()
    })
  } else if (caseState === "Resolved") {
    query.andWhere({
      resolutionTimestamp: Not(IsNull())
    })
  }

  if (allocatedToUserName) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorLockedByUsername: allocatedToUserName }).orWhere({
          triggerLockedByUsername: allocatedToUserName
        })
      })
    )
  }

  if (locked !== undefined) {
    if (locked) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ errorLockedByUsername: Not(IsNull()) }).orWhere({ triggerLockedByUsername: Not(IsNull()) })
        })
      )
    } else {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ errorLockedByUsername: IsNull() }).andWhere({ triggerLockedByUsername: IsNull() })
        })
      )
    }
  }

  const result = await query.getManyAndCount().catch((error: Error) => error)
  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default listCourtCases
