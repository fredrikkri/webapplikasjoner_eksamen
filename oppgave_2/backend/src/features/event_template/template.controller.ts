import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { templateService, TemplateService } from "./template.service";

export const createTemplateController = (templateService: TemplateService) => {
    const app = new Hono();

    app.get("/templates", async (c) => {
        const result = await templateService.list()
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result);
      });

      app.post("/templates/add", async (c) => {
        const data = await c.req.json();
        const result = await templateService.create(data);
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result, { status: 201 });
      });


      app.get("/templates/:event_slug", async (c) => {
        const eventSlug = c.req.param("event_slug");
        const result = await templateService.getTemplatesByEventSlug(eventSlug);
    
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

export const templateController = createTemplateController(templateService);