import { rest } from "msw"

export const conductor = [
  rest.get("http://localhost:5002/api/workflow/bichard_process/correlated/*", (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          workflowId: "test workflow id"
        }
      ])
    )
  }),
  rest.get("http://localhost:5002/api/queue/update/*/wait_for_resubmission/COMPLETED", (_req, res, ctx) =>
    res(ctx.status(200))
  )
]
