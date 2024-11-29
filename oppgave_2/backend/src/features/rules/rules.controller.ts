import { Hono } from "hono";
import { rulesService, type RulesService } from "./rules.service";
import { errorResponse, type ErrorCode } from "../../lib/error";

export const createRulesController = (rulesService: RulesService) => {
    const app = new Hono();

    app.get("/rules/:eventId", async (c) => {
        const eventId = c.req.param("eventId");
        const result = await rulesService.getByEventId(eventId);

        if (!result.success)
            return errorResponse(
                c,
                result.error.code as ErrorCode,
                result.error.message
            );
        return c.json(result);
    });

    return app;
};

export const RulesController = createRulesController(rulesService);
