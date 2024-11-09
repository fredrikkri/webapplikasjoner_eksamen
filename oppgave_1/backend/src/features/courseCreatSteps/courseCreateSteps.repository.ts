import { db, type DB } from "../../features/db";
import {type CourseCreateSteps} from "../../types/courseCreateSteps";
import type { Result } from "../../types/index";

export const createCourseCreateStepsRepository = (db: DB) => {

    const listCourseCreateSteps = async (): Promise<Result<CourseCreateSteps[]>> => {
        try {
          const CourseCreateStepsQuery = db.prepare("SELECT * FROM courseCreateSteps");
          const data = CourseCreateStepsQuery.all() as CourseCreateSteps[];
          return { success: true, data };
        } catch  {
          return { success: false, 
            error:{code: "NOT_FOUND", message: "courseCreateSteps not found"} };
        }
      };

      return {listCourseCreateSteps};
    };
    
    export const courseCreateStepsRepository = createCourseCreateStepsRepository(db);
    
    export type CourseCreateStepsRepository = ReturnType<typeof createCourseCreateStepsRepository>;