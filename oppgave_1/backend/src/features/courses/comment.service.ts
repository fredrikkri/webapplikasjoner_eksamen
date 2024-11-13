import type { Result } from "../../types/index";
import type { Comment } from "../../types/comment";
import { commentRepository, type CommentRepository } from "./comment.repository";

export const createCommentService = (repository: CommentRepository) => {
  const create = async (data: Comment): Promise<Result<Comment>> => {
    return repository.create(data);
  };

  const getCommentsByLessonId = async (lessonId: string): Promise<Result<Comment[]>> => {
    return repository.getCommentsByLessonId(lessonId);
  };

  return { create, getCommentsByLessonId };
};

export const commentService = createCommentService(commentRepository);

export type CommentService = ReturnType<typeof createCommentService>;
