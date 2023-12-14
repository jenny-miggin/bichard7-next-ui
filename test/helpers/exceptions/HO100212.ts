import { faker } from "@faker-js/faker"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail!.PersonName.Title =
    faker.string.alpha(40)

  aho.Exceptions.push({
    code: ExceptionCode.HO100212,
    path: [] // TODO: figure out how to get paths
  })
  return aho
}
