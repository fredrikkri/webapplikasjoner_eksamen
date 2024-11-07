import { Hono } from "hono";
import { lessonService } from "./lesson.service";

export const app = new Hono();

app.get("/courses/:courseId/lessons", async (c) => {
  const { courseId } = c.req.param();
  const lessons = await lessonService.getLessonsByCourse(courseId);
  return c.json({ data: lessons });
});

app.get("/courses/:courseId/lessons/:slug", async (c) => {
  const { courseId, slug } = c.req.param();
  const lesson = await lessonService.getLessonBySlug(courseId, slug);
  return lesson ? c.json({ data: lesson }) : c.json({ error: "Lesson not found" }, 404);
});
