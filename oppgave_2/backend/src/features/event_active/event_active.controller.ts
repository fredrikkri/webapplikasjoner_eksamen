import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { ActiveEventsService, activeEventsService } from "./event_active.service";

export const createActiveEventsController = (activeEventsService: ActiveEventsService) => {
    const app = new Hono();

    app.get("/activeevents", async (c) => {
        const result = await activeEventsService.list()
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result);
      });

      app.post("/add", async (c) => {
        const data = await c.req.json();
        const result = await activeEventsService.create(data);
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result, { status: 201 });
      });


      app.get("/activeevents/:event_id", async (c) => {
        const eventId = c.req.param("event_id");
        const result = await activeEventsService.getActiveEventsByEventId(eventId);
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result);
      });

    return app;
}

export const activeEventsController = createActiveEventsController(activeEventsService);