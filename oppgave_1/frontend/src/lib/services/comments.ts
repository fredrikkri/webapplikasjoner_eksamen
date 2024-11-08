import { fetchWithRetry } from "../utils/apiUtils";
import { BASE_URL } from "../../config/config";

interface CreatedBy {
  id: string;
  name: string;
}

interface LessonRef {
  slug: string;
}

export interface Comment {
  id: string;
  createdBy: CreatedBy;
  comment: string;
  lesson: LessonRef;
}

// Fetch comments for a lesson
export const getComments = async (lessonSlug: string): Promise<Comment[]> => {
  try {
    const response = await fetchWithRetry<Comment[]>(
      `${BASE_URL}/lessons/${lessonSlug}/comments`
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

// Create a new comment
export const createComment = async (data: Comment): Promise<void> => {
  try {
    const response = await fetchWithRetry<Comment>(
      `${BASE_URL}/lessons/${data.lesson.slug}/comments`,
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
