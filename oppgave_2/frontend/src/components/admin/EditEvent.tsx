'use client';

import { editEvent } from "@/lib/services/events";
import { useEffect, useState } from "react";
import { getEvent } from "@/lib/services/events";

interface EditEventProps {
  eventSlug: string;
}

export default function EditEvent({ eventSlug }: EditEventProps) {
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    slug: "",
    date: "",
    location: "",
    event_type: "",
    total_slots: 0,
    available_slots: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const event = await getEvent(eventSlug);
        if (event) {
          setFormData({
            id: event.id,
            title: event.title,
            description: event.description,
            slug: event.slug,
            date: event.date,
            location: event.location,
            event_type: event.event_type,
            total_slots: event.total_slots,
            available_slots: event.available_slots,
            price: event.price,
          });
        }
      } catch (err) {
        setError("Failed to fetch event data: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await editEvent(formData);
      alert("Event oppdatert!");
    } catch (err) {
      setError("Error updating event: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Rediger arrangement</h1>
      {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tittel</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Dato</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokasjon</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">Kategori</label>
          <input
            type="text"
            id="event_type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="total_slots" className="block text-sm font-medium text-gray-700">Antall plasser</label>
          <input
            type="number"
            id="total_slots"
            name="total_slots"
            value={formData.total_slots}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Pris</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center justify-center ${
            isLoading ? "bg-gray-300" : "bg-teal-600 hover:bg-teal-500"
          } text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2`}
        >
          {isLoading ? "Oppdaterer..." : "Oppdater Event"}
        </button>
      </form>
    </div>
  );
}
