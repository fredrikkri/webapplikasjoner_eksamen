import { Event } from "@/types/Event";
import { ENDPOINTS } from "../../config/config";
import { Template } from "../../types/Template"
import { getRulesByEventId } from "./rules";

export const getTemplate = async (slug: string): Promise<Template | undefined> => {
  const response = await fetch(ENDPOINTS.templates + `/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch event");
  }

  const template = result.data as Template;
  
  try {
    // Fetch rules using the template id
    const rules = await getRulesByEventId(template.id);
    if (rules) {
      template.rules = rules;
    }
    
  } catch (error) {
    console.error("Failed to fetch rules:", error);
  }

  return template;
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

  const templates = result.data as Template[];
  
  // Fetch rules for each template
  const templatesWithRules = await Promise.all(
    templates.map(async (template) => {
      try {
        const rules = await getRulesByEventId(template.id);
        if (rules) {
          template.rules = rules;
        }
      } catch (error) {
        console.error(`Failed to fetch rules for template ${template.id}:`, error);
      }
      return template;
    })
  );

  return templatesWithRules;
};

export const onAddTemplate = async ({ event_id }: { event_id: string }): Promise<{ success: boolean; data?: { template_id: number } }> => {
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
      console.error("Failed to create template:", data.error);
      return { success: false };
    }

    return {
      success: true,
      data: {
        template_id: parseInt(data.data)
      }
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return { success: false };
  }
};

export const deleteTemplate = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(`${ENDPOINTS.deleteTemplate(eventId)}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error(`Failed to delete template: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error, could not delete template:", error);
    throw error;
  }
};

export const editTemplate = async (eventData: Event): Promise<void> => {
  try {
    const response = await fetch(`${ENDPOINTS.editTemplate(eventData)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });
  
    if (!response.ok) {
      throw new Error(`Failed to edit template: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error, could not edit template:", error);
    throw error;
  }
};
