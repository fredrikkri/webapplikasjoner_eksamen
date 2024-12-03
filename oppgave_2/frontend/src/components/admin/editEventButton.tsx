import { useState } from "react";
import { Event } from "../../types/Event";

interface EditEventProps {
  event: Event | null;
}

export default function EditEventButton({ event }: EditEventProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    if (event) {
      setIsLoading(true);
      try {
        window.location.href = `/events/${event.slug}/edit`;
      } catch (error) {
        console.error("Error editing event:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-end gap-4 p-2">
      <button
        onClick={handleEdit}
        disabled={isLoading}
        className={`
          inline-flex items-center px-4 py-2 rounded-lg font-medium text-white
          transition-all duration-200 shadow-sm
          ${isLoading
            ? "bg-amber-300 cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2  transform hover:scale-[1.02] active:scale-[0.98]"}
        `}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Laster...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1.5"
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
            Rediger arrangement
          </>
        )}
      </button>
    </div>
  );
}
