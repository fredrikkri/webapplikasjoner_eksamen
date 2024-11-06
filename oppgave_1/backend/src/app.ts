import { Hono } from "hono";
import { cors } from "hono/cors";
import { port } from "./config";
import { CourseController } from "./features/courses/course.controller";

const app = new Hono();

app.use("/*", cors({
  origin: "http://localhost:"+port,
  credentials: true,
}));

app.route("api/v1", CourseController)

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
