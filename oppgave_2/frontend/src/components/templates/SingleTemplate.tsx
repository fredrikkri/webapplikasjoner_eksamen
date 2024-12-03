import TemplateCardExpanded from './TemplateCardExpanded';
import { useTemplate } from '@/hooks/useTemplate';

interface TemplateProps {
  slug: string;
}

function SingleTemplate({ slug = "" }: TemplateProps) {
  const { template, loading, error } = useTemplate(slug);

  {/* SRC: kilde: chatgpt.com  || Tailwind laget med gpt */}
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-indigo-600">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-lg font-medium">Laster mal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-red-800 mb-2">Ops! Noe gikk galt</p>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-lg font-medium text-indigo-900">Fant ikke mal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-2">Mal</h1>
        <p className="text-indigo-600">Bruk denne malen som utgangspunkt for ditt arrangement</p>
      </div>
      
      <TemplateCardExpanded 
        id={template.id}
        title={template.title} 
        description={template.description} 
        slug={template.slug}
        date={template.date} 
        location={template.location} 
        event_type={template.event_type}
        total_slots={template.total_slots}
        available_slots={template.available_slots}
        price={template.price}
        rules={template.rules}
        template_id={template.template_id}
      />
    </div>
  );
}

export default SingleTemplate;
