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
    const result = await EventService.create(data);
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result, { status: 201 });
  });

  return app;
}

export const EventController = createEventController(eventService);