"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Event as EventData } from "../../types/Event";
import { useCreateEvent } from "../../hooks/useEvent";
import { onAddTemplate } from "@/lib/services/templates";
import { onAddActiveEvent } from "@/lib/services/activeEvents";

// SRC: kilde: chatgpt.com  / med endringer
const CreateEvent: React.FC = () => {
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData>({
    id: '',
    title: '',
    description: '',
    date: new Date().toISOString(),
    location: '',
    slug: '',
    event_type: '',
    total_slots: 0,
    available_slots: 0,
    price: 0,
  });

  const { addEvent, loading, error } = useCreateEvent();

  const generateSlug = (title: string) => {
    const randomId = crypto.randomUUID();
    const titleSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniquePart = randomId.slice(0, 6);
    return `${titleSlug}-${uniquePart}`;
  };

    // SRC: kilde: chatgpt.com  / med endringer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setEventData((prevData) => ({
      ...prevData,
      [name]: name === "total_slots" || name === "available_slots" || name === "price" ? Number(value) : value,
      slug: name === "title" ? generateSlug(value) : prevData.slug,
      available_slots: name === "available_slots" ? 0 : prevData.total_slots,
    }));
  };

    // SRC: kilde: chatgpt.com  / med endringer
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();
            //const action = e.currentTarget.getElementsByTagName("button").namedItem("action")?.getAttribute("value"); 

    eventData.id = crypto.randomUUID();

    try {
      if (action === "addTemplate") {
        await addEvent(eventData);
        const templateResponse = await onAddTemplate({ event_id: eventData.slug });
  
        if (templateResponse) {
          setEventData(eventData);
          router.push(`/templates/${eventData.slug}`);
        } else {
          console.error("Failed to create template");
        }
      } else if (action === "addEvent") {
        await addEvent(eventData);
        const activeEventResponse = await onAddActiveEvent({ event_id: eventData.slug })
        if(activeEventResponse){
          setEventData(eventData)
          router.push(`/events/${eventData.slug}`);
        }
      }
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const inputClasses = "mt-2 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-200";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

  // SRC: kilde: chatgpt.com  / med endringer
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={(e) => handleSubmit(e, (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") as string)} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Opprett et nytt arrangement</h2>
          <p className="mt-2 text-slate-600">Fyll ut skjemaet under for å opprette et nytt arrangement</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className={labelClasses}>
              Tittel
              <input
                type="text"
                name="title"
                value={eventData.title || ""}
                onChange={handleChange}
                className={inputClasses}
                required
                placeholder="Skriv inn arrangementets tittel"
              />
            </label>
          </div>

          <div>
            <label className={labelClasses}>
              Beskrivelse
              <textarea
                name="description"
                value={eventData.description || ""}
                onChange={handleChange}
                className={`${inputClasses} h-32 resize-none`}
                required
                placeholder="Beskriv arrangementet"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Dato
                <input
                  type="date"
                  name="date"
                  value={eventData.date || ""}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </label>
            </div>

            <div>
              <label className={labelClasses}>
                Lokasjon
                <input
                  type="text"
                  name="location"
                  value={eventData.location || ""}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  placeholder="Hvor skal arrangementet holdes?"
                />
              </label>
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Kategori
              <select
                name="event_type"
                value={eventData.event_type || ""}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Velg en kategori</option>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Antall plasser
                <input
                  type="number"
                  name="total_slots"
                  value={eventData.total_slots || 0}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  min="0"
                />
              </label>
            </div>

            <div>
              <label className={labelClasses}>
                Pris (NOK)
                <input
                  type="number"
                  name="price"
                  value={eventData.price || 0}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                  min="0"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            name="action"
            value="addTemplate"
            type="submit"
            className="w-2/5 bg-slate-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition duration-200 shadow-sm"
          >
            Lagre som mal
          </button>

          <button
            name="action"
            value="addEvent"
            type="submit"
            className="w-3/5 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 shadow-sm"
          >
            Opprett Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
