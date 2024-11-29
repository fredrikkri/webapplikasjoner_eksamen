import type { Result } from "../../types/index";
import { rulesRepository, type RulesRepository } from "./rules.repository";
import type { Rules } from "../../types/rules";
import { createRulesResponse } from "./rules.mapper";

export const createRulesService = (rulesRepository: RulesRepository) => {
    const create = async (eventId: string, rulesData: Omit<Rules, 'event_id'>): Promise<Result<string>> => {
        return rulesRepository.create(eventId, rulesData);
    };

    const getByEventId = async (eventId: string): Promise<Result<Rules>> => {
        const result = await rulesRepository.getByEventId(eventId);
        if (!result.success) return result;

        return {
            success: true,
            data: createRulesResponse(result.data),
        };
    };

    return { create, getByEventId };
};

export const rulesService = createRulesService(rulesRepository);

export type RulesService = ReturnType<typeof createRulesService>;
