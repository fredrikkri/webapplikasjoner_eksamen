import type { Result } from "../../types/index";
import { createCommentResponse } from "./comment.mapper";
import {
  commentRepository,
  type CommentRepository,
} from "./comment.repository";

import {
    Comment,
} from "../../types/comment";

export const createCommentService = (commentRepository: CommentRepository) => {

    const getCommentsByLessonSlug = async (lessonSlug: string): Promise<Result<Comment[] | undefined>> => {
        // return commentRepository.getCommentsByLessonSlug(lessonSlug);
        const result = await commentRepository.getCommentsByLessonSlug(lessonSlug);
        if (!result.success) return result;

        return {
          ...result,
          data: result.data.map(createCommentResponse),
        };
        
    };


return {
    getCommentsByLessonSlug, 

  };
};


export const commentService = createCommentService(commentRepository);

export type CommentService = ReturnType<typeof createCommentService>;