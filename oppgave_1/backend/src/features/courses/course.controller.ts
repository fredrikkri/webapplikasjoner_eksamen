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

  app.get("/courses/:slug", async (c) => {
    const slug = c.req.param("slug");
    const result = await CourseService.getById(slug);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.get("/comments/:lessonSlug", async (c) => {
    const lessonSlug = c.req.param("lessonSlug");
    const result = await CourseService.getCommentsByLessonSlug(lessonSlug);

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

//   app.get("/courses/:id/lessons", async (c) => {
//     const id = c.req.param("id");
//     const result = await CourseService.getById(id);
//     const result2 = await CourseService.getLessonsById(id);

//     if (!result.success) {
//         return errorResponse(
//             c,
//             result.error.code as ErrorCode,
//             result.error.message
//         );
//     }

//     if (!result2.success) {
//         return errorResponse(
//             c,
//             result2.error.code as ErrorCode,
//             result2.error.message
//         );
//     }
//     return c.json(result2);
// });

app.get("/courses/:slug/:slugLesson", async (c) => {
  const slug = c.req.param("slug");
  const slugLesson = c.req.param("slugLesson");
  const result = await CourseService.getById(slug);
  const result2 = await CourseService.getLessonById(slugLesson);

  if (!result.success) {
      return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
      );
  }

  if (!result2.success) {
      return errorResponse(
          c,
          result2.error.code as ErrorCode,
          result2.error.message
      );
  }
  return c.json(result2);
});

  return app;
};

export const CourseController = createCourseController(courseService);