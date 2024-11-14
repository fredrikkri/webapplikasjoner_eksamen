import { useState, useEffect } from "react";
import { getComments, createComment } from "../lib/services";

interface CreatedBy {
  id: string | number;  // Keep as union type for flexibility in input
  name: string;
}

interface LessonRef {
  slug: string;
}

export interface Comment {
  id: string;
  createdBy: {
    id: string;  // Service expects string
    name: string;
  };
  comment: string;
  lesson: LessonRef;
}

export interface CommentData {
  id: string;
  createdBy: CreatedBy;  // Allow string | number for id in input
  comment: string;
  lesson: LessonRef;
}

export const useComments = (lessonSlug: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getComments(lessonSlug);
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (lessonSlug) {
      fetchComments();
    }
  }, [lessonSlug]);

  return { comments, loading, error };
};

export const useCreateComment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addComment = async (commentData: CommentData) => {
    try {
      setLoading(true);
      // Convert the commentData to match the service's expected type
      const serviceComment: Comment = {
        ...commentData,
        createdBy: {
          ...commentData.createdBy,
          id: String(commentData.createdBy.id)  // Convert id to string
        }
      };
      await createComment(serviceComment);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { addComment, loading, error };
};
