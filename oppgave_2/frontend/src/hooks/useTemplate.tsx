import { useState, useEffect } from "react";
import {Template as TemplateType} from "../types/Template"
import { getAllTemplates, getTemplate, onAddTemplate } from "../lib/services/templates";
import {Event as EventType} from "../types/Event"

export const useAllTemplates = () => {
  const [templates, setTemplates] = useState<TemplateType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const eventdata = await getAllTemplates();
        setTemplates(eventdata as unknown as TemplateType[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching all templates'));
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
};

export const useTemplate = (templateSlug: string) => {
  const [template, setTemplate] = useState<TemplateType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const eventdata = await getTemplate(templateSlug);
        setTemplate(eventdata as unknown as TemplateType);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching an template'));
      } finally {
        setLoading(false);
      }
    };

    if (templateSlug) {
      fetchTemplate();
    }
  }, [templateSlug]);

  return { template, loading, error };
};

export const useCreateEvent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addTemplate = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await onAddTemplate({ event_id: eventId });
      
      if (!response) {
        throw new Error("Template creation failed.");
      }

      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred."));
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addTemplate, loading, error };
};