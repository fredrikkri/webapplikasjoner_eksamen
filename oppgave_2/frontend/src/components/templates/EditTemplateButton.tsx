import { useState } from 'react';
import { editTemplate } from '@/lib/services/templates';
import { Event as EventData } from "../../types/Event";

interface TemplateEditProps {
  eventData: EventData;
}

export default function EditTemplateButton(props: TemplateEditProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleEdit = async () => {
    if (!props.eventData.id) {
      setError("Event-ID mangler, kan ikke oppdatere.");
      return;
    }

    setIsLoading(true);
    setError(null);


    try {
      const responseEdit = await editTemplate(props.eventData);

      if (responseEdit.success) {
        setTimeout(() => {
          window.location.href = '/templates';
        });
        alert(responseEdit.data);
      } 
    } catch (err) {
      setError(
        "En feil oppsto under oppdatering: " +
        (err instanceof Error ? err.message : "Ukjent feil")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <button
        onClick={handleEdit}
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-4 px-6 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 transform ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-400 text-white focus:ring-amber-300"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        {isLoading ? 'Endrer...' : 'Endre Mal'}
      </button>
    </div>
  );
}
