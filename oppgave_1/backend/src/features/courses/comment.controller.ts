import { Hono } from "hono";
import { commentService, type CommentService } from "./comment.service";
import { errorResponse, type ErrorCode } from "../../lib/error";

export const createCommentController = (CommentService: CommentService) => {
  const app = new Hono();

  app.get("/lessons/:lessonSlug/comments", async (c) => {
    const lessonSlug = c.req.param("lessonSlug");
    const result = await CommentService.getCommentsByLessonSlug(lessonSlug);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.post("/lessons/:lessonSlug/comments", async (c) => {
    const data = await c.req.json();
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
