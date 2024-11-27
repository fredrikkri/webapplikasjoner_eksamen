import { BASE_URL, ENDPOINTS } from "../../config/config";
import { Template } from "../../types/Template"

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

export const onAddTemplate = async ({ event_id }: { event_id: string }) => {
  try {
    const response = await fetch(ENDPOINTS.createTemplate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id }),
    });

    const data = await response.json();
    if (!data.success) {
      console.log("FAIL: ", data.data);
      return;
    }
    return data;
  } catch (error) {
    console.log("fail catch");
  } finally {
    console.log("finally");
  }
};