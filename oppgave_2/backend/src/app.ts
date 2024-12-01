import { Hono } from "hono";
import { cors } from "hono/cors";
import { EventController } from "./features/event/event.controller";
import { registrationController } from "./features/registration/registration.controller";
import { templateController } from "./features/event_template/template.controller";
import { activeEventsController } from "./features/event_active/event_active.controller";
import { waitlistController } from "./features/wait_list/waitlist.controller";
import { RulesController } from "./features/rules/rules.controller";
import { excelController } from "./features/excel/excel.controller";

const app = new Hono();
app.use("/*", cors());

app.use("/*", cors({
  origin: "http://localhost:4000",
  credentials: true,
}));

app.route("api/v1", EventController)
app.route("api/v1", registrationController)
app.route("api/v1", waitlistController)
app.route("api/v1", templateController)
app.route("api/v1", activeEventsController)
app.route("api/v1", RulesController)
app.route("api/v1", excelController)

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
