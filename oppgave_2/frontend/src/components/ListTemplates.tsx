'use client';
import { useAllTemplates } from "@/hooks/useTemplate";
import { useEffect, useState } from "react";
import TemplateCard from "./TemplateCard";
import { Template } from "@/types/Template";

function ListTemplates() {
const { templates, loading, error } = useAllTemplates(); 
const [data, setData] = useState<Template[]>([]);

// SRC: kilde: chatgpt.com  / med endringer
useEffect(() => {
    if (templates && templates.length) {
      setData(templates);
    }
  }, [templates]);

if (loading) return <div className="flex items-center justify-center h-screen text-gray-600 text-lg font-semibold animate-pulse">Laster inn maler...</div>;

if (error) return (
    <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {error.message}
      </p>
    </div>
  );

  if (!templates) return (
    <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-6 text-center">
      <p className="text-lg font-medium text-slate-800">
        Fant ikke maler
      </p>
    </div>
  );

  return (
    <div>
      <div>
        {data.length > 0 ? (
          data.map((template) => (
            <TemplateCard 
              key={template.id}
              id={template.id}
              title={template.title} 
              description={template.description} 
              date={template.date} 
              location={template.location} 
              slug={template.slug}
              event_type={template.event_type}
            />
          ))
        ) : (
          <p>Ingen tilgjengelige arrangementer for valgt filter.</p>
        )}
      </div>
    </div>
  );

};

export default ListTemplates;