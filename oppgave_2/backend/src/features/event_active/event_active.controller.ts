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

      app.post("/activeevents/add", async (c) => {
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


      app.get("/activeevents/:eventSlug", async (c) => {
        const eventSlug = c.req.param("eventSlug");
        const result = await activeEventsService.getActiveEventsByEventSlug(eventSlug);
    
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