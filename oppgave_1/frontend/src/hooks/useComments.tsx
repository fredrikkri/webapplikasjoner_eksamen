import { useState, useEffect, useCallback } from "react";
import { getComments, createComment } from "../lib/services";
import { Comment, CommentData } from "../types/types"

export const useComments = (lessonId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getComments(lessonId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId, fetchComments]);

  return { comments, loading, error, refreshComments: fetchComments };
};

export const useCreateComment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addComment = async (commentData: CommentData) => {
    try {
      setLoading(true);
      const serviceComment: Comment = {
        ...commentData,
        createdBy: {
          ...commentData.createdBy,
          id: String(commentData.createdBy.id)
        }
      };
      await createComment(serviceComment);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
};
