import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { commentService, type CommentService } from "./comment.service";

export const createCommentController = (CommentService: CommentService) => {
    const app = new Hono();

    app.get("/comments/:lessonSlug", async (c) => {
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

    return app;
}

export const commentController = createCommentController(commentService);