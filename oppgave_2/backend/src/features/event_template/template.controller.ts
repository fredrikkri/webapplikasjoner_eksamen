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

      app.post("/add", async (c) => {
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

    return app;
}

export const templateController = createTemplateController(templateService);