import { comments } from "../../data/data";

interface CreatedBy {
  id: string;  // Changed from string | number to just string
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

// Henter kommentarer basert på lessonSlug
export const getComments = async (lessonSlug: string): Promise<Comment[]> => {
  const filteredComments = comments.filter(
    (comment) => comment.lesson.slug === lessonSlug
  );
  return filteredComments;
};

// Oppretter en ny kommentar og legger den til kommentardataen
export const createComment = async (data: Comment): Promise<void> => {
  // Convert any number id to string to ensure type consistency
  const commentData: Comment = {
    ...data,
    createdBy: {
      ...data.createdBy,
      id: String(data.createdBy.id)
    }
  };
  comments.push(commentData);
};
