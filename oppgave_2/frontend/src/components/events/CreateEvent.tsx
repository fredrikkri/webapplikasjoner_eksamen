"use client";
import React, { FormEvent, useState } from 'react';
import { Event as EventData } from '@/types/Event';
import { useCreateEvent } from '@/hooks/useEvent';
import { ENDPOINTS } from '@/config/config';

// SRC: kilde: chatgpt.com  / med endringer
const CreateEvent: React.FC = () => {

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

    // SRC: kilde: chatgpt.com 
    const generateSlug = (title: string) => {
      const randomId = crypto.randomUUID()
      const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    
      const uniquePart = randomId.slice(0, 6);
      return `${titleSlug}-${uniquePart}`;
  };

  // SRC: kilde: chatgpt.com  / med endringer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setEventData((prevData) => ({
      ...prevData,
      [name]: name === 'total_slots' || name === 'available_slots' || name === 'price' ? Number(value) : value,
      slug: name === 'title' ? generateSlug(value) : prevData.slug,
      available_slots: name == 'available_slots' ? 0 : prevData.total_slots
      }));
  };

  // SRC: kilde: chatgpt.com  / med endringer
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();
    //const action = e.currentTarget.getElementsByTagName("button").namedItem("action")?.getAttribute("value"); 

    console.log(`Button clicked: ${action}`);
    const action2 = e.currentTarget.getElementsByTagName("button")
    console.log("pre-sub ", eventData.slug)
    eventData.id = crypto.randomUUID();
    if (action === "addTemplate") {
      console.log("handlesubmit: \n",eventData.slug)
      await addEvent(eventData);
      await onAddTemplate({ event_id: eventData.slug });
    } else if (action === "addEvent") {
      await addEvent(eventData);
    }
  };

  const onAddTemplate = async ({ event_id }: { event_id: string }) => {
    try {
      const response = await fetch(ENDPOINTS.createTemplate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id }),
      });
      const data = await response.json();
      if (!data.success) {
        console.log("FAIL: ", data.data)
        return;
      }
      setEventData(data.data);
      console.log("setData: ", data.data)
    } catch (error) {
      console.log("fail catch")
    } finally {
      console.log("finally")    }
  };

  // SRC: kilde: chatgpt.com  / med endringer
  return (
    <form onSubmit={(e) => handleSubmit(e, (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") as string)} className="max-w-md mx-auto p-4 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold mb-4">Opprett et nytt arrangement</h2>

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
          value={eventData.slug || ""}
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
          value={eventData.event_type || ""}
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
          value={eventData.total_slots || 0}
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
          Lagre som mal
        </button>

        <button
          name="action"
          value="addEvent"
          type="submit"
          className="w-3/5 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
        >
          Opprett Event
        </button>
      </div>

    </form>
  );
};

export default CreateEvent;
