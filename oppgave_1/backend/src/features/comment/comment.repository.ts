import { Comment } from "@/types/comment";
import { db, type DB } from "../../features/db";
import type { Result } from "../../types/index";
import { fromDb} from "./comment.mapper";

export const createCommentRepository = (db: DB) => {

    const lessonExist = async (slug: string): Promise<boolean> => {
        const query = db.prepare(
          "SELECT COUNT(*) as count FROM lessons WHERE slug = ?"
        );
        const data = query.get(slug) as { count: number };
        return data.count > 0;
      };

    const getCommentsByLessonSlug = async (lessonSlug: string): Promise<Result<Comment[]>> => {
        try {
        const lessonExists = await lessonExist(lessonSlug);
        if (!lessonExists) {
            return {
            success: false,
            error: { code: "NOT_FOUND", message: "Course not found" },
            };
        }
  
      const query = db.prepare("SELECT * FROM comments WHERE lesson_slug = ?");
      const comments = query.all(lessonSlug) as Comment[];
  
      if (comments.length === 0) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "No comments found for this lesson" },
        };
      }

      return {
        success: true,
        data: comments,
      };
  
    } catch (error) {
      console.error("Error fetching lesson:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching lesson",
        },
      };
    }
}

  return { getCommentsByLessonSlug};
};

export const commentRepository = createCommentRepository(db);

export type CommentRepository = ReturnType<typeof createCommentRepository>;