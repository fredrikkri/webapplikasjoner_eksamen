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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-indigo-600">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-lg font-medium">Laster inn maler...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-red-800 mb-2">Ops! Noe gikk galt</p>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!templates) {
    return (
      <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50 p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-lg font-medium text-indigo-900">Fant ikke maler</p>
      </div>
    );
  }
  // SRC: kilde: chatgpt.com  / Tailwind er laget med gpt
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Maler</h1>
        <p className="text-indigo-600">Bruk disse malene som utgangspunkt for dine arrangementer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <div className="col-span-2 rounded-xl bg-indigo-50 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-indigo-900">Ingen tilgjengelige maler</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListTemplates;
