import ColumnHeading from "features/CourtCaseFilters/ColumnHeading"
import ColumnOrderIcons from "features/CourtCaseFilters/ColumnOrderIcons"
import { Link, Table } from "govuk-react"
import { useRouter } from "next/router"
import styled from "styled-components"
import type { QueryOrder } from "types/CaseListQueryParams"
import { blue } from "utils/colours"

const HeaderCellAlt = styled(Table.Cell)``
const HeaderCell = styled(Table.CellHeader)`
  height: 100%;
  vertical-align: bottom;
  border-color: var(--border-input);
`
const HeaderLink = styled(Link)`
  color: ${blue};
  display: flex;
  align-items: center;
  &:focus: {
    max-width: fit-content;
  }
  &:active: {
    color: ${blue};
  }
  &:visited: {
    color: ${blue};
  }
  &:hover: {
    color: ${blue};
  }
`

interface CourtCaseListTableHeaderProps {
  order: QueryOrder
}

export const CourtCaseListTableHeader = ({ order }: CourtCaseListTableHeaderProps) => {
  const { basePath, query } = useRouter()
  const orderByParams = (orderBy: string) => `${basePath}/?${new URLSearchParams({ ...query, orderBy, order })}`

  return (
    <Table.Row>
      <HeaderCellAlt className={"table-column-header-cell"} />
      <HeaderCell className={"table-column-header-cell"} setWidth={"178px"}>
        <HeaderLink
          className={"table-column-header-link"}
          href={orderByParams("defendantName")}
          id="defendant-name-sort"
        >
          {"Defendant name"}
          <ColumnOrderIcons columnName={"defendantName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"table-column-header-cell"} setWidth={"115px"}>
        <HeaderLink className={"table-column-header-link"} href={orderByParams("courtDate")} id="court-date-sort">
          {"Court date"}
          <ColumnOrderIcons columnName={"courtDate"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"table-column-header-cell"}>
        <HeaderLink className={"table-column-header-link"} href={orderByParams("courtName")} id="court-name-sort">
          {"Court name"}
          <ColumnOrderIcons columnName={"courtName"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"table-column-header-cell"}>
        <HeaderLink className={"table-column-header-link"} href={orderByParams("ptiurn")} id="ptiurn-sort">
          {"PTIURN"}
          <ColumnOrderIcons columnName={"ptiurn"} currentOrder={query.order} orderBy={query.orderBy} />
        </HeaderLink>
      </HeaderCell>
      <HeaderCell className={"table-column-header-cell"}>
        <ColumnHeading>{"Notes"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={"table-column-header-cell"}>
        <ColumnHeading>{"Reason"}</ColumnHeading>
      </HeaderCell>
      <HeaderCell className={"table-column-header-cell"}>
        <ColumnHeading>{"Locked by"}</ColumnHeading>
      </HeaderCell>
    </Table.Row>
  )
}
