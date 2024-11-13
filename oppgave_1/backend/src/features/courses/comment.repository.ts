import { db, type DB } from "../../features/db";
import type { Result } from "../../types/index";
import type { Comment } from "../../types/comment";

export const createCommentRepository = (db: DB) => {
  const create = async (data: Comment): Promise<Result<Comment>> => {
    try {
      const query = db.prepare(`
        INSERT INTO comments (createdBy, comment, lesson_id)
        VALUES (?, ?, ?)
      `);
      
      query.run(
        JSON.stringify(data.createdBy),
        data.comment,
        data.lesson.id
      );

      return {
        success: true as const,
        data: data,
      };
    } catch (error) {
      console.error("Error creating comment:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating comment",
        },
      };
    }
  };

  const getCommentsByLessonId = async (lessonId: string): Promise<Result<Comment[]>> => {
    try {
      const query = db.prepare(`
        SELECT * FROM comments 
        WHERE lesson_id = ?
      `);
      
      const comments = query.all(lessonId) as any[];
      
      const formattedComments = comments.map(comment => ({
        id: comment.id.toString(),
        createdBy: JSON.parse(comment.createdBy),
        comment: comment.comment,
        lesson: { id: comment.lesson_id }
      }));

      return {
        success: true as const,
        data: formattedComments,
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching comments",
        },
      };
    }
  };

  return { create, getCommentsByLessonId };
};

export const commentRepository = createCommentRepository(db);

export type CommentRepository = ReturnType<typeof createCommentRepository>;
