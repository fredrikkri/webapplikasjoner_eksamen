import { Hono } from "hono";
import { commentService, type CommentService } from "./comment.service";
import { errorResponse, type ErrorCode } from "../../lib/error";

export const createCommentController = (CommentService: CommentService) => {
  const app = new Hono();

  app.get("/lessons/:lessonId/comments", async (c) => {
    const lessonId = c.req.param("lessonId");
    const result = await CommentService.getCommentsByLessonId(lessonId);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.post("/lessons/:lessonId/comments", async (c) => {
    const data = await c.req.json();
    const lessonId = c.req.param("lessonId");
    // Ensure the lesson id from the URL is used
    data.lesson = { id: lessonId };
    
    const result = await CommentService.create(data);
    
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result, { status: 201 });
  });

  return app;
};

export const CommentController = createCommentController(commentService);
