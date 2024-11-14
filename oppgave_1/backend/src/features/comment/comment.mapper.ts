import { Comment } from "@/types/comment";
import { createId } from "../../util/utils";



export const createCommentResponse = (data: Comment): Comment => {
  const { id, createdBy, comment, lesson_slug } = data;
    
  return {
    ...data,
    createdBy, 
    comment, 
    lesson_slug
    };
};

export const fromDb = (data: Comment) => {
    return {
      id: data.id ?? createId(),  
      createdBy: data?.createdBy ?? "unknown",
      comment: data?.comment ?? "unknown",
      lesson: data?.lesson_slug ?? "unknown"
    };
};

