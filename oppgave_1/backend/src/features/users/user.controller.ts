import { Hono } from "hono";
import { UserService, userService } from "./user.service";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { validateQuery } from "../../lib/query";

export const createUserController = (userService: UserService) => {
    const app = new Hono();
  
    app.get("/users", async (c) => {
      const query = validateQuery(c.req.query()).data ?? {};
  
      const result = await userService.list(query);
  
      if (!result.success)
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      return c.json(result);
    });
  
    app.get("users/:id", async (c) => {
      const id = c.req.param("id");
      const result = await userService.getById(id);
  
      if (!result.success)
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      return c.json(result);
    });
  
    app.post("/users", async (c) => {
      const data = await c.req.json();
      const result = await userService.create(data);
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
  
  export const userController = createUserController(userService);