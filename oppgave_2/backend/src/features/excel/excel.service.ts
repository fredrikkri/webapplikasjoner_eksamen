import { registrationRepository } from "./excel.repository";
import { type RegistrationWithEventByYear } from "../../types/excel";
import { Result } from "@/types";

// SRC: kilde: chatgpt.com / med endringer
export const registrationService = {
  async getRegistrationsByYear(): Promise<Result<Record<number, RegistrationWithEventByYear[]>>> {
    try {
      const result = await registrationRepository.getAllRegistrationsWithEvents();
      
      if (!result.success) {
        return { success: false, error: result.error };
      }

      const registrations = result.data;

      const groupedByYear = registrations.reduce((acc: Record<number, RegistrationWithEventByYear[]>, reg: RegistrationWithEventByYear) => {
        const year = new Date(reg.registration_date).getFullYear();
        if (!acc[year]) acc[year] = [];
        acc[year].push(reg);
        return acc;
      }, {});

      return { success: true, data: groupedByYear };
    } catch (error) {
      console.error("Error in service:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process registrations by year",
        },
      };
    }
  },
};
