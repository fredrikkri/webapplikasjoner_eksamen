import { useState } from 'react';
//import { deleteTemplate } from '../../lib/services/templates';
import { Event } from "../../types/Event";
import { deleteTemplate } from '@/lib/services/templates';

interface TemplateProps {
  templateId: string;
}

export default function DeleteTemplate(props: TemplateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const handleDelete = async () => {
    if (props.templateId) {
      setIsLoading(true);
      setError(null);

      try {
        await deleteTemplate(props.templateId);
        window.location.href = '/events';
      } catch (err) {
        setError("Error deleting event: " + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={`${
          isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
        } bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300`}
      >
        {isLoading ? 'Sletter...' : 'Slett Mal'}
      </button>
  );
}
