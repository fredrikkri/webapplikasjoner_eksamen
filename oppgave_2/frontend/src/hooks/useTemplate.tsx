import { useState, useEffect } from "react";
import {Template as TemplateType} from "../types/Template"
import { getAllTemplates, getTemplate } from "@/lib/services/templates";

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