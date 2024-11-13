import { Query } from "@/lib/query";
import { templateRepository, TemplateRepository } from "./template.repository";
import { Result } from "@/types";
import { Event } from "@/types/event";
import { createTemplateResponse } from "./template.mapper";

export const createTemplateService = (templateRepository: TemplateRepository) => {

    const list = async (query?: Query): Promise<Result<Event[]>> => {
        const result = await templateRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createTemplateResponse),
        };
      };


return {
    list,
  };
};

export const templateService = createTemplateService(templateRepository);

export type TemplateService = ReturnType<typeof createTemplateService>;