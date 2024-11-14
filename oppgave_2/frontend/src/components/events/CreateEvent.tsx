"use client";
import React, { useState } from 'react';
import { Event as EventData } from '@/types/Event';
import { useCreateEvent } from '@/hooks/useEvent';

// SRC: kilde: chatgpt.com  / med endringer
const CreateEvent: React.FC = () => {
  const [eventData, setEventData] = useState<EventData>({
    id: crypto.randomUUID(),
    title: '',
    description: '',
    date: new Date(),
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
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEvent(eventData);
  };

  // SRC: kilde: chatgpt.com  / med endringer
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold mb-4">Opprett et nytt arrangement</h2>

      <label className="block">
        Tittel:
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </label>

      <label className="block">
        Slug:
        <input
          type="text"
          name="slug"
          value={eventData.slug}
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
          value={eventData.description}
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
          value={eventData.date.toString()}
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
          value={eventData.location}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </label>

      <label className="block">
        Event Type:
        <select
          name="event_type"
          value={eventData.event_type}
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
        Totale plasser:
        <input
          type="number"
          name="total_slots"
          value={eventData.total_slots}
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
          value={eventData.price}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </label>

      <div className="flex space-x-4 w-full">
  <button type="button" className="w-2/5 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500">
    Lagre som mal
  </button>

  <button type="submit" className="w-3/5 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700">
    Opprett Event
  </button>
</div>
    </form>
  );
};

export default CreateEvent;
