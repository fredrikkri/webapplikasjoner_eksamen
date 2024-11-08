import type { Result } from "../../types/index";
import type { Comment } from "../../types/comment";
import { commentRepository, type CommentRepository } from "./comment.repository";

export const createCommentService = (repository: CommentRepository) => {
  const create = async (data: Comment): Promise<Result<Comment>> => {
    return repository.create(data);
  };

  const getCommentsByLessonSlug = async (lessonSlug: string): Promise<Result<Comment[]>> => {
    return repository.getCommentsByLessonSlug(lessonSlug);
  };

  return { create, getCommentsByLessonSlug };
};

export const commentService = createCommentService(commentRepository);

export type CommentService = ReturnType<typeof createCommentService>;
