import { useState } from 'react';
import { deleteEvent } from '../../lib/services/events';
import { Event } from "../../types/Event";

interface RegCardProps {
  event: Event | null;
}

export default function DeleteEvent(props: RegCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const handleDelete = async () => {
    if (props.event) {
      setIsLoading(true);
      setError(null);

      try {
        console.log("yoyoyoyoy: ",props.event.id)
        await deleteEvent(props.event.id);
        alert('Event deleted successfully');
      } catch (err) {
        setError("Error deleting event: " + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="delete-event-card flex justify-end items-center p-5 space-x-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={`${
          isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
        } text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300`}
      >
        {isLoading ? 'Sletter...' : 'Slett Event'}
      </button>
    </div>
  );
}
