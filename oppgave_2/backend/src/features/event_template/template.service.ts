import { Query } from "@/lib/query";
import { templateRepository, TemplateRepository } from "./template.repository";
import { Result } from "@/types";
import { Event, EventWithRules } from "@/types/event";
import { createTemplate, createTemplateResponse } from "./template.mapper";
import { TemplateCreate, validateTemplateCreate } from "../../types/template";

export const createTemplateService = (templateRepository: TemplateRepository) => {

    const list = async (query?: Query): Promise<Result<Event[]>> => {
        const result = await templateRepository.list(query);
        if (!result.success) return result;
    
        return {
          ...result,
          data: result.data.map(createTemplateResponse),
        };
      };

      const remove = async (id: string): Promise<Result<string>> => {
        return templateRepository.remove(id);
      };

      const edit = async (data: EventWithRules): Promise<Result<string>> => {
        return templateRepository.edit(data);
      };

      const create = async (data: TemplateCreate): Promise<Result<string>> => {
        console.log("creat service: \n", data.event_id)
        const registration = createTemplate(data);
    
        if (!validateTemplateCreate(registration).success) {
          return {
            success: false,
            error: { code: "BAD_REQUEST", message: "Invalid Template data" },
          };
        }
        return templateRepository.create(registration);
      };

      // SRC: kilde: chatgpt.com  || med endringer /
      const getTemplatesByEventSlug = async (eventSlug: string): Promise<Result<Event | undefined>> => {
        const result = await templateRepository.getEventByTemplateSlug(eventSlug);
        
        if (!result.success) return result;
      
        if (result.data) {
          const templateResponse = createTemplateResponse(result.data);
          return {
            success: true,
            data: templateResponse,
          };
        }
      
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "No template found for the provided event ID.",
          },
        };
      };
      

return { list, create, getTemplatesByEventSlug, remove, edit };
};

export const templateService = createTemplateService(templateRepository);

export type TemplateService = ReturnType<typeof createTemplateService>;