"use client";
import React, { useState } from 'react';
import { Event as EventData } from '@/types/Event';

// SRC: kilde: chatgpt.com  / med endringer
const CreateEvent: React.FC = () => {
  const [eventData, setEventData] = useState<EventData>({
    id: "",
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

  // SRC: kilde: chatgpt.com  / med endringer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: name === 'total_slots' || name === 'available_slots' || name === 'price' ? Number(value) : value,
    });
  };

  // SRC: kilde: chatgpt.com  / med endringer
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Event opprettet:\n${JSON.stringify(eventData, null, 2)}`);
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
        Slug:
        <input
          type="text"
          name="slug"
          value={eventData.slug}
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
          <option value="">Velg type</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="webinar">Webinar</option>
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
        Ledige plasser:
        <input
          type="number"
          name="available_slots"
          value={eventData.available_slots}
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

      <button type="submit" className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700">
        Opprett Event
      </button>
    </form>
  );
};

export default CreateEvent;
