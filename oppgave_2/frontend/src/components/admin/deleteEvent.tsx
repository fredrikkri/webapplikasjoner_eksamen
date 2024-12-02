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
    <div className="delete-event-card">
      <button
        onClick={handleDelete}
        disabled={isLoading}
        style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
      >
        {isLoading ? 'deleting...' : 'Delete Event'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
