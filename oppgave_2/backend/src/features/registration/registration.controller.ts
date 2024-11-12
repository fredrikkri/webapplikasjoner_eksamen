import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { registrationService, RegistrationService } from "./registration.service";

export const createRegistrationController = (registrationService: RegistrationService) => {
    const app = new Hono();

    app.get("/registrations", async (c) => {
        const result = await registrationService.list()
    
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
        const result = await registrationService.create(data);
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

export const registrationController = createRegistrationController(registrationService);