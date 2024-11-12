import { Hono } from "hono";
import { cors } from "hono/cors";
import { EventController } from "./features/event/event.controller";
import { registrationController } from "./features/registration/registration.controller";

const app = new Hono();
app.use("/*", cors());

app.use("/*", cors({
  origin: "http://localhost:4000",
  credentials: true,
}));

app.route("api/v1", EventController)
app.route("api/v1", registrationController)

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
