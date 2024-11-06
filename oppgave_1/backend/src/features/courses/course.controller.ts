import { Hono } from "hono";
import { courseService, type CourseService } from "./course.service";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { validateQuery } from "../../lib/query";

export const createCourseController = (CourseService: any) => {
  const app = new Hono();

  app.get("/courses", async (c) => {
    const query = validateQuery(c.req.query()).data ?? {};

    const result = await CourseService.list(query);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.get("/courses/:id", async (c) => {
    const id = c.req.param("id");
    const result = await CourseService.getById(id);

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
    const result = await CourseService.create(data);
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result, { status: 201 });
  });

  app.patch("courses/:id", async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();

    const result = await CourseService.update({ id, ...data });
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.delete("/courses/:id", async (c) => {
    console.log("USED BACKEND")
    const id = c.req.param("id");
    console.log("BACKEND ID:", id)

    const result = await CourseService.remove(id);
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

export const CourseController = createCourseController(courseService);