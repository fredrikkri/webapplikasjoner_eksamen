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

      app.delete("/delete-template/:eventId", async (c) => {
        try {
          const eventId = c.req.param("eventId");
          console.log("eventId: ",eventId)
          const result = await templateService.remove(eventId);
          
          if (!result.success) {
            return errorResponse(
              c,
              result.error.code as ErrorCode,
              result.error.message
            );
          }
          return c.json(result, {status: 200});
        } catch (error) {
          console.error('Error in template deletion:', error);
          return errorResponse(
            c,
            'INTERNAL_SERVER_ERROR',
            error instanceof Error ? error.message : 'Failed to delete template'
          );
        }
      });

      app.patch("/edit-template/:templateId", async (c) => {
        try {
          const templateId = c.req.param("templateId");
          const data = await c.req.json();

          const result = await templateService.edit(data);
          console.log("Result endre mal hvis event basert på mal finnes: ", result)
          
          if (!result.success) {
            return errorResponse(
              c,
              result.error.code as ErrorCode,
              result.error.message
            );
          }
          return c.json(result, {status: 200});
        } catch (error) {
          console.error('Error in template deletion:', error);
          return errorResponse(
            c,
            'INTERNAL_SERVER_ERROR',
            error instanceof Error ? error.message : 'Failed to edit template'
          );
        }
      });

    return app;
}

export const templateController = createTemplateController(templateService);