import { onAddActiveEvent } from "@/lib/services/activeEvents";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Event as EventData } from "../../types/Event";

type TemplateCardProps = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    slug: string;
    event_type: string;
    total_slots: number; 
    available_slots: number;
    price: number
  }
  
  const generateSlug = (title: string) => {
    const randomId = crypto.randomUUID();
    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniquePart = randomId.slice(0, 6);
    return `${titleSlug}-${uniquePart}`;
  };

  export default function TemplateCardExpanded({slug, title, description, date, location, event_type, total_slots, available_slots, price}: TemplateCardProps) {

    const [eventData, setEventData] = useState<EventData>({
      id: '',
      title: title,
      description: description,
      date: date,
      location: location,
      slug: slug,
      event_type: event_type,
      total_slots: total_slots,
      available_slots: available_slots,
      price: price,
    });
  
    const handleActivateEvent = async (e: FormEvent<HTMLFormElement>, event_slug: string) => {
      try {
        await onAddActiveEvent({ event_id: event_slug })
  
      } catch (error) {
        console.error("Error handling submit:", error);
      }
    };
  
      // SRC: kilde: chatgpt.com  / med endringer
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        setEventData((prevData) => ({
          ...prevData,
          [name]: value
          }));
      };

    return (
      <form onSubmit={(e) => handleActivateEvent(e, slug)} className="max-w-md mx-auto p-4 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold mb-4">Mal for {title}</h2>
  
        <label className="block">
          Tittel:
          <input
            type="text"
            name="title"
            value={eventData.title || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
  
        <label className="block">
          URL-Slug:
          <input
            type="text"
            name="slug"
            value={generateSlug(eventData.title)}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            readOnly
          />
        </label>
  
        <label className="block">
          Beskrivelse:
          <textarea
            name="description"
            value={eventData.description || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
  
        <label className="block">
          Dato:
          <input
            type="date"
            name="date"
            value={eventData.date || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
  
        <label className="block">
          Lokasjon:
          <input
            type="text"
            name="location"
            value={eventData.location || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
  
        <label className="block">
          Kategori:
          <select
            name="event_type"
            value={eventData.event_type || event_type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Ingen kategori</option>
            <option value="Seminar">Seminar</option>
            <option value="Webinar">Webinar</option>
            <option value="Kurs">Kurs</option>
            <option value="Konsert">Konsert</option>
            <option value="Opplæring">Opplæring</option>
            <option value="Presentasjon">Presentasjon</option>
            <option value="Forelesning">Forelesning</option>
            <option value="Kunngjøring">Kunngjøring</option>
          </select>
        </label>
  
        <label className="block">
          Antall plasser:
          <input
            type="number"
            name="total_slots"
            value={eventData.total_slots || 0}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
  
        <label className="block">
          Pris:
          <input
            type="number"
            name="price"
            value={eventData.price || 0}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </label>
  
        <div className="flex space-x-4 w-full">
          <button
            name="action"
            value="addTemplate"
            type="submit"
            className="w-2/5 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
          >
            Lagre som ny mal
          </button>
  
          <button
            name="action"
            value="addEvent"
            type="submit"
            className="w-3/5 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
          >
            Start Arrangement
          </button>
        </div>
      </form>
    );
  }
  