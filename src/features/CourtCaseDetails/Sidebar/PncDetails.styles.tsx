import styled from "styled-components"
import { gdsLightGrey, gdsMidGrey, textSecondary } from "utils/colours"

const UpdatedDate = styled.div`
  padding: 15px 20px;
  font-size: 16px;
  color: ${textSecondary};
  border-bottom: solid 1px ${gdsMidGrey};
`

const CourtCase = styled.div`
  font-family: var(--default-font-family);
  font-size: var(--default-font-size);
`

const CourtCaseHeader = styled.div`
  display: flex;
  flex-direction: column;

  padding: 15px 20px;
  background-color: ${gdsLightGrey};
  border-bottom: solid 1px ${gdsMidGrey};
`

const CCR = styled.h1`
  margin: 0;
  padding-bottom: 10px;
`

const CrimeOffenceReference = styled.div`
  display: flex;
  flex-direction: row;

  .heading {
    font-weight: bold;
  }

  & > * {
    flex: 1;
  }
`

const Offence = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  row-gap: 15px;

  .heading {
    display: flex;
    flex-direction: row;

    & > span {
      margin-bottom: 0;
    }

    .acpo-code {
      font-weight: normal;
    }

    & > * {
      flex: 1;
    }
  }

  .details {
    display: flex;
    flex-wrap: wrap;
    row-gap: 15px;

    & > * {
      flex-basis: 50%;
    }
  }
`

const DisposalHeader = styled.div`
  background-color: ${gdsLightGrey};
  border-bottom: solid 1px ${gdsMidGrey};
`

const DisposalDetails = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    flex-basis: 31%;

    :not(:last-child) {
      margin-right: 2%;
    }
  }
`

export { UpdatedDate, CourtCase, CourtCaseHeader, CrimeOffenceReference, CCR, Offence, DisposalHeader, DisposalDetails }
