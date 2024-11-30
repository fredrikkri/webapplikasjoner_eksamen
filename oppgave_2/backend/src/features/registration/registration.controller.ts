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

      app.post("/registrer", async (c) => {
        const data = await c.req.json();

        console.log("Raw data: ", data)
        const result = await registrationService.create(data);
        console.log("Geir: ", result)
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
         
        return c.json(result, { status: 201 });
      });

      app.post("/registrerWishlist", async (c) => {
        const data = await c.req.json();

        const result = await registrationService.createByOrderID(data);
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
         
        return c.json(result, { status: 201 });
      });

      app.get("/registrations/:event_id", async (c) => {
        const eventId = c.req.param("event_id");
        const result = await registrationService.getRegistrationsByEventId(eventId);
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result);
      });

      app.delete("/deleteregistration/:id", async (c) => {
        const registrationId = c.req.param("id");
        const result = await registrationService.deleteRegistration(registrationId);
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json({ success: true, message: "Registration deleted successfully" });
      });

    return app;
}

export const registrationController = createRegistrationController(registrationService);