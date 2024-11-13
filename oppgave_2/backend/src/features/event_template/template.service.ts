import { Query } from "@/lib/query";
import { templateRepository, TemplateRepository } from "./template.repository";
import { Result } from "@/types";
import { Event } from "@/types/event";
import { createTemplate, createTemplateResponse } from "./template.mapper";
import { TemplateCreate, validateTemplateCreate } from "@/types/template";

export const createTemplateService = (templateRepository: TemplateRepository) => {

    const list = async (query?: Query): Promise<Result<Event[]>> => {
        const result = await templateRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createTemplateResponse),
        };
      };

      const create = async (data: TemplateCreate): Promise<Result<string>> => {
        const registration = createTemplate(data);
    
        if (!validateTemplateCreate(registration).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Template data" },
          };
        }
        return templateRepository.create(registration);
      };


return { list, create };
};

export const templateService = createTemplateService(templateRepository);

export type TemplateService = ReturnType<typeof createTemplateService>;