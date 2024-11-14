import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { courseCreateStepsService, type CourseCreateStepsService } from "./courseCreateSteps.service";

export const createCourseCreateStepsController = (CourseCreateStepsService: CourseCreateStepsService) => {
    const app = new Hono();

    app.get("/courseCreateSteps", async (c) => {
        const result = await CourseCreateStepsService.listCourseCreateSteps();
    
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


export const courseCreateStepsController = createCourseCreateStepsController(courseCreateStepsService);