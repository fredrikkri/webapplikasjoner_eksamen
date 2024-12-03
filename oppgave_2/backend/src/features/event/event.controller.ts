import { Hono } from "hono";
import { eventService, type EventService } from "./event.service";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { validateQuery } from "../../lib/query";

export const createEventController = (EventService: any) => {
  const app = new Hono();

  app.get("/events", async (c) => {
    const query = validateQuery(c.req.query()).data ?? {};
    const result = await EventService.list(query);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.get("/events/:slug", async (c) => {
    const slug = c.req.param("slug");
    const result = await EventService.getById(slug);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.post("/create", async (c) => {
    const data = await c.req.json();
    console.log("Received data on server:", data);
    const result = await EventService.create(data);
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result, { status: 201 });
  });

  app.delete("/delete-event/:eventId", async (c) => {
    try {
      const eventId = c.req.param("eventId");
      console.log("eventId: ",eventId)
      const result = await EventService.remove(eventId);
      
      if (!result.success) {
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }
      return c.json(result, {status: 200});
    } catch (error) {
      console.error('Error in event deletion:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to delete event'
      );
    }
  });

  app.patch("/edit-event/:eventId", async (c) => {
    try {
      const eventId = c.req.param("eventId");
      const data = await c.req.json();

      const result = await eventService.edit(data);
      
      if (!result.success) {
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }
      return c.json(result, {status: 200});
    } catch (error) {
      console.error('Error in event deletion:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to edit event'
      );
    }
  });

  return app;
}

export const EventController = createEventController(eventService);