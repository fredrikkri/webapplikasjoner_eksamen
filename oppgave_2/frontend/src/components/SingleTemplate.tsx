import TemplateCardExpanded from './EventCardExpanded';
import { useTemplate } from '@/hooks/useTemplate';

interface TemplateProps {
  slug: string;
}

function SingleTemplate({ slug = "" }: TemplateProps) {
 
  const { template, loading, error } = useTemplate(slug);

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-600 text-lg font-semibold animate-pulse">Laster arrangementer...</div>;

  if (error) return (
    <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6 text-center">
      <p className="text-lg font-medium text-red-800">
        Noe gikk galt: {error.message}
      </p>
    </div>
  );

  if (!template) return (
    <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-6 text-center">
      <p className="text-lg font-medium text-slate-800">
        Fant ikke mal
      </p>
    </div>
  );

  return (
    <TemplateCardExpanded 
      title={template.title} 
      description={template.description} 
      slug={template.slug}
      date={template.date} 
      location={template.location} 
      event_type={template.event_type}
      total_slots={template.total_slots}
      available_slots={template.available_slots}
      price={template.price} 
      />
  );
};

export default SingleTemplate;
