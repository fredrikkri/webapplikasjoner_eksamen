import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { waitlistService, WaitlistService } from "./waitlist.service";

export const createWaitlistRegistrationController = (waitlistRegistrationService: WaitlistService) => {
    const app = new Hono();

    app.get("/waitlist-registrations", async (c) => {
        const result = await waitlistRegistrationService.list()
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result);
      });

      app.get(":event_id/waitlist-orders", async (c) => {
        const eventId = c.req.param("event_id");
        const result = await waitlistRegistrationService.listOrders(eventId)
    
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
        return c.json(result);
      });

      app.post("/waitlist-registrer", async (c) => {
        const data = await c.req.json();
        console.log("Raw data: ", data)
        const result = await waitlistRegistrationService.create(data);
        console.log("Geir: ", result)
        if (!result.success)
          return errorResponse(
            c,
            result.error.code as ErrorCode,
            result.error.message
          );
         
        return c.json(result, { status: 201 });
      });

      app.get("/waitlist-registrations/:event_id", async (c) => {
        const eventId = c.req.param("event_id");
        const result = await waitlistRegistrationService.getWaitlistRegistrationsByEventId(eventId);
    
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

export const waitlistController = createWaitlistRegistrationController(waitlistService);