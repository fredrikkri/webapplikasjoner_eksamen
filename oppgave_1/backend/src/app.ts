import { Hono } from "hono";
import { cors } from "hono/cors";
import { port } from "./config";

const app = new Hono();

app.use("/*", cors({
  origin: "http://localhost:"+port,
  credentials: true,
}));


app.get("/", (c) => {
  return c.json({ message: "Welcome to the Hono server!" });
});

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
