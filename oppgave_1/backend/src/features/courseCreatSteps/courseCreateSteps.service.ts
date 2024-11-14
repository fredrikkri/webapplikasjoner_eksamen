import type { Result } from "../../types/index";
import {
    courseCreateStepsRepository,
  type CourseCreateStepsRepository,
} from "./courseCreateSteps.repository";


import { CourseCreateSteps, CourseCreateStepsResponse } from "@/types/courseCreateSteps";

export const createCourseCreateStepsService = (courseCreateStepsRepository: CourseCreateStepsRepository) => {

const listCourseCreateSteps = async (): Promise<Result<CourseCreateStepsResponse[]>> => {
    return courseCreateStepsRepository.listCourseCreateSteps();
     
  };

return {
    listCourseCreateSteps
  };
};

export const courseCreateStepsService = createCourseCreateStepsService(courseCreateStepsRepository);

export type CourseCreateStepsService = ReturnType<typeof createCourseCreateStepsService>;