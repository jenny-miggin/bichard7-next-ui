import Note from "../../../src/services/entities/Note"
import Trigger from "../../../src/services/entities/Trigger"
import { DataSource, EntityManager } from "typeorm"
import { isError } from "../../../src/types/Result"

export default async function addNotes(
  pgDataSource: DataSource | EntityManager,
  courtCaseId: number,
  triggerCodesToResolve: string[],
  resolvedTriggers: Trigger[]
) {
  const triggersNotes = triggerCodesToResolve.reduce((acc: string[], trigger) => {
    const totalTriggers = resolvedTriggers.filter((t) => t.triggerCode === trigger).length
    if (totalTriggers > 0) {
      acc.push(`${totalTriggers} x ${trigger}`)
    }
    return acc
  }, [])
  if (triggersNotes.length > 0) {
    const notesResult = await pgDataSource
      .getRepository(Note)
      .insert({
        errorId: courtCaseId,
        userId: "System",
        createdAt: new Date(),
        noteText: [
          `System Action: Triggers Resolved. Code ${triggersNotes.join(", ")}. `,
          process.env.TRIGGER_NOTE
        ].join("\n")
      })
      .catch((error: Error) => error)

    if (isError(notesResult)) {
      throw notesResult
    }
  }
}
