import { BASE_URL, ENDPOINTS } from "@/config/config";

export interface Template {
  id: string;
  title: string;
  description: string;
  slug: string;
  date: Date;
  location: string;
  event_type: string;
  total_slots: string;
  available_slots: number;
  price: number;
}

export const getTemplate = async (slug: string): Promise<Template | undefined> => {
  const response = await fetch(ENDPOINTS.templates + `/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch event");
  }

  return result.data as Template;
};

export const getAllTemplates = async (): Promise<Template[]> => {
  const response = await fetch(ENDPOINTS.templates);
  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch templates");
  }

  return result.data as Template[];
};
