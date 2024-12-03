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
    <div className="flex justify-end p-4">
      <button
        onClick={handleEdit}
        disabled={isLoading}
        className={`
          inline-flex items-center px-4 py-2 rounded-lg font-medium text-black
          transition-all duration-200 shadow-sm
          ${isLoading
            ? "bg-yellow-300 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"}
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
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v2m0 12v2m8-8h-2M4 12H2m15.364-7.364l-1.414 1.414m0 10.95l1.414-1.414M6.343 6.343l1.414 1.414M6.343 17.657l1.414-1.414"
              />
            </svg>
            Rediger arrangement
          </>
        )}
      </button>
    </div>
  );
}
