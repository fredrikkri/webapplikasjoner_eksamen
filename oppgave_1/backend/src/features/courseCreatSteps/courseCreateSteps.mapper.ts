import { CourseCreateSteps } from "@/types/courseCreateSteps";
import { createId } from "../../util/utils";



export const createCourseCreateStepsResponse = (data: CourseCreateSteps): CourseCreateSteps => {
  const { id, name } = data;
    
  return {
    ...data,
    name, 
    };
};

export const fromDb = (data: CourseCreateSteps) => {
    return {
      id: data.id ?? createId(),  
      name: data?.name ?? "unknown",
    };
};