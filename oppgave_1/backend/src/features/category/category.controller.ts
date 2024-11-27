import { Hono } from "hono";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { validateQuery } from "../../lib/query";
import { categoryService, CategoryService } from "./category.service";

export const createCategoryController = (categoryService: CategoryService) => {
    const app = new Hono();
  
    app.get("/categories", async (c) => {
      const query = validateQuery(c.req.query()).data ?? {};
  
      const result = await categoryService.list(query);
  
      if (!result.success)
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );

      return c.json({
        success: true,
        data: result.data
      });
    });
  
    app.get("/categories/:id", async (c) => {
      const id = c.req.param("id");
      const result = await categoryService.getById(id);
  
      if (!result.success)
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );

      return c.json({
        success: true,
        data: result.data
      });
    });
  
    return app;
  };
  
  export const CategoryController = createCategoryController(categoryService);