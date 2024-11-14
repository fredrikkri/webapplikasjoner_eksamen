import { fetchWithRetry } from "../utils/apiUtils";
import { BASE_URL } from "../../config/config";
import { Comment } from "@/types/types";

export const getComments = async (lessonId: string): Promise<Comment[]> => {
  try {
    const response = await fetchWithRetry<Comment[]>(
      `${BASE_URL}/lessons/${lessonId}/comments`
    );
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error?.message || 'Failed to fetch comments');
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (data: Comment): Promise<void> => {
  try {
    const response = await fetchWithRetry<Comment>(
      `${BASE_URL}/lessons/${data.lesson.id}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create comment');
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};
