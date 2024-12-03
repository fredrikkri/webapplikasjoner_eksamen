import { useState } from 'react';
import { deleteTemplate } from '@/lib/services/templates';
import { Event } from "../../types/Event";

interface TemplateProps {
  templateId: string;
}

export default function DeleteTemplateButton(props: TemplateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const handleDelete = async () => {
    if (props.templateId) {
      setIsLoading(true);
      setError(null);

      try {
        const responseEdit = await deleteTemplate(props.templateId);
        setTimeout(() => {
          window.location.href = '/templates';
        });
        if (responseEdit.data === undefined) {
          alert("Kunne ikke slette mal siden malen allerede er i bruk.");
        } else {
          alert("Malen ble slettet!");
        }
      } catch (err) {
        setError("Error deleting event: " + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }
  };

    // SRC: kilde: chatgpt.com  || Tailwind laget med gpt /
  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className={`
        flex items-center justify-center
        ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'}
        text-white font-semibold py-4 px-6 rounded-lg shadow-md 
        transition-all duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 
        transform hover:scale-[1.02] active:scale-[0.98]
        w-[120px]
      `}
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      {isLoading ? 'Sletter...' : 'Slett'}
    </button>
  );
}
