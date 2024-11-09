import { Hono } from "hono";
import { cors } from "hono/cors";
import { CourseController } from "./features/courses/course.controller";
import { userController } from "./features/users/user.controller";
import { categoryController } from "./features/category/category.controller";
import { commentController } from "./features/comment/comment.controller";
import { courseCreateStepsController } from "./features/courseCreatSteps/courseCreateSteps.controller";

const app = new Hono();

app.use("/*", cors({
  origin: "http://localhost:4000",
  credentials: true,
}));

app.route("api/v1", CourseController)
app.route("api/v1", userController)
app.route("api/v1", categoryController)
app.route("api/v1", commentController)
app.route("api/v1", courseCreateStepsController)

//app.route("api/v1", LessonController);

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
