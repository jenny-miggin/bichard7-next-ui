import { faker } from "@faker-js/faker"
import { subSeconds } from "date-fns"
import { countBy, sample } from "lodash"
import { DataSource } from "typeorm"
import Note from "../../src/services/entities/Note"
import Trigger from "../../src/services/entities/Trigger"

export default (dataSource: DataSource, caseId: number, triggers: Trigger[], isResolved: boolean): Note[] => {
  const triggerCounts = countBy(triggers, (trigger) => trigger.triggerCode)
  const triggerCountsNote =
    "Trigger codes: " +
    Object.entries(triggerCounts)
      .map(([triggerCode, count]) => `${count} x ${triggerCode}`)
      .join(", ")

  const resolvedTriggerNotes = triggers
    .filter((trigger) => trigger.resolvedAt !== null)
    .map(
      (trigger) =>
        `${faker.name.firstName()}.${faker.name.lastName()}: Portal Action: Trigger Resolved. Code: ${
          trigger.triggerCode
        }`
    )

  const noteTexts = [triggerCountsNote, ...resolvedTriggerNotes]

  if (isResolved) {
    const reason = sample([
      "Updated remand(s) manually on the PNC",
      "Updated disposal(s) manually on the PNC",
      "PNC record already has accurate results"
    ])
    const reasonText = Math.random() > 0.5 ? faker.lorem.sentence() : ""
    noteTexts.push(
      `${faker.name.firstName()}.${faker.name.lastName()}: Portal Action: Record Manually Resolved. Reason: ${reason}. Reason Text:${reasonText}`
    )
  }

  return noteTexts.map((noteText) =>
    dataSource.getRepository(Note).create({
      noteText,
      errorId: caseId,
      userId: `${faker.name.firstName().toLowerCase()}.${faker.name.lastName().toLowerCase()}`.slice(0, 31),
      createdAt: subSeconds(new Date(), Math.random() * 60 * 60 * 24 * 30)
    })
  )
}
