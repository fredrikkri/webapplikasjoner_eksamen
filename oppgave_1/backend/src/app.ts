import { Hono } from "hono";
import { cors } from "hono/cors";
import { CourseController } from "./features/courses/course.controller";
import { CommentController } from "./features/comment/comment.controller";
import { CategoryController } from "./features/category/category.controller";

const app = new Hono();

app.use("/*", cors({
  origin: ["http://localhost:4000", "http://localhost:3999"],
  credentials: true,
}));

app.route("/api/v1", CourseController);
app.route("/api/v1", CommentController);
app.route("/api/v1", CategoryController);

app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      error: {
        message: err.message,
      },
    },
    { status: 500 }
  );
});

export default app;
