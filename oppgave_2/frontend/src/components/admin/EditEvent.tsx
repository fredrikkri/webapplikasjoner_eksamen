'use client';

import { editEvent, getEvent } from "@/lib/services/events";
import { useEffect, useState } from "react";
import { validateEventData, hasValidationErrors } from "@/util/validation";
import { VALIDATION } from "@/config/config";
import { getRulesByEventId, applyRules } from "@/lib/services/rules";
import { Rules } from "@/types/Rules";

interface EditEventProps {
  eventSlug: string;
}

export default function EditEvent({ eventSlug }: EditEventProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
  const [rules, setRules] = useState<Rules>();
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

  const appliedRules = rules ? applyRules(rules) : {
    shouldDisablePrice: false,
    shouldDisableSize: false,
    priceValue: undefined,
    isDateAllowed: () => true,
  };

  useEffect(() => {
    const fetchEventAndRules = async () => {
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

          const eventRules = await getRulesByEventId(event.id);
          setRules(eventRules);
        }
      } catch (err) {
        setError("Failed to fetch event data: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventAndRules();
  }, [eventSlug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    
    if (name === "date") {
      const selectedDate = new Date(value);
      if (!appliedRules.isDateAllowed(selectedDate)) {
        alert('Denne datoen er ikke tillatt basert på valgte restriksjoner.');
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "total_slots" || name === "price" 
        ? Number(value) 
        : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value === "0") {
      input.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const validationResults = validateEventData(formData);
    setValidationErrors(validationResults);

    if (hasValidationErrors(validationResults)) {
      setIsLoading(false);
      return;
    }

    try {
      await editEvent(formData);
      alert("Event oppdatert!");
    } catch (err) {
      setError("Error updating event: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "mt-2 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const errorClasses = "text-red-500 text-sm mt-1";
  const disabledClasses = "bg-slate-100 cursor-not-allowed";
  const numberInputClasses = `${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative pr-12`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-5xl mx-auto rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
      <div className="flex justify-between items-center pb-6 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-indigo-900">Rediger arrangement</h2>
          <p className="mt-2 text-slate-600">Oppdater arrangementets detaljer</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>Tittel</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${inputClasses} ${validationErrors.title ? 'border-red-500' : ''}`}
            placeholder="Skriv inn arrangementets tittel"
          />
          {validationErrors.title && <p className={errorClasses}>{validationErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>Beskrivelse</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`${inputClasses} resize-none ${validationErrors.description ? 'border-red-500' : ''}`}
            placeholder="Beskriv arrangementet"
          ></textarea>
          {validationErrors.description && <p className={errorClasses}>{validationErrors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className={labelClasses}>Dato</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`${inputClasses} ${validationErrors.date ? 'border-red-500' : ''}`}
            />
            {validationErrors.date && <p className={errorClasses}>{validationErrors.date}</p>}
            {rules?.restricted_days && (
              <p className="text-sm text-slate-600 mt-1">
                Tillatte dager: {rules.restricted_days}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="location" className={labelClasses}>Lokasjon</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`${inputClasses} ${validationErrors.location ? 'border-red-500' : ''}`}
              placeholder="Hvor skal arrangementet holdes?"
            />
            {validationErrors.location && <p className={errorClasses}>{validationErrors.location}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="event_type" className={labelClasses}>Kategori</label>
          <select
            id="event_type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${validationErrors.event_type ? 'border-red-500' : ''}`}
          >
            <option value="">Velg kategori</option>
            {VALIDATION.eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {validationErrors.event_type && <p className={errorClasses}>{validationErrors.event_type}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="total_slots" className={labelClasses}>Antall plasser</label>
            <div className="relative">
              <input
                type="number"
                id="total_slots"
                name="total_slots"
                value={formData.total_slots}
                onChange={handleChange}
                onKeyDown={handleNumberInput}
                min="0"
                className={`${numberInputClasses} ${validationErrors.total_slots ? 'border-red-500' : ''} ${appliedRules.shouldDisableSize ? disabledClasses : ''}`}
                disabled={appliedRules.shouldDisableSize}
              />
              <div className="absolute right-0 inset-y-0 flex flex-col border-l border-slate-300">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'total_slots', value: String(formData.total_slots + 1) } })}
                  className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center border-b border-slate-300 rounded-tr-lg"
                  disabled={appliedRules.shouldDisableSize}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'total_slots', value: String(Math.max(0, formData.total_slots - 1)) } })}
                  className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center rounded-br-lg"
                  disabled={appliedRules.shouldDisableSize}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            {validationErrors.total_slots && <p className={errorClasses}>{validationErrors.total_slots}</p>}
            {appliedRules.shouldDisableSize && (
              <p className="text-sm text-slate-600 mt-1">Antall plasser kan ikke endres for dette arrangementet</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className={labelClasses}>Pris (NOK)</label>
            <div className="relative">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onKeyDown={handleNumberInput}
                min="0"
                className={`${numberInputClasses} ${validationErrors.price ? 'border-red-500' : ''} ${appliedRules.shouldDisablePrice ? disabledClasses : ''}`}
                disabled={appliedRules.shouldDisablePrice}
              />
              <div className="absolute right-0 inset-y-0 flex flex-col border-l border-slate-300">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'price', value: String(formData.price + 1) } })}
                  className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center border-b border-slate-300 rounded-tr-lg"
                  disabled={appliedRules.shouldDisablePrice}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'price', value: String(Math.max(0, formData.price - 1)) } })}
                  className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center rounded-br-lg"
                  disabled={appliedRules.shouldDisablePrice}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            {validationErrors.price && <p className={errorClasses}>{validationErrors.price}</p>}
            {appliedRules.shouldDisablePrice && (
              <p className="text-sm text-slate-600 mt-1">Prisen kan ikke endres for dette arrangementet</p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center ${
              isLoading ? "bg-slate-300" : "bg-blue-600 hover:bg-blue-500"
            } text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            {isLoading ? "Oppdaterer..." : "Lagre endringer"}
          </button>
        </div>
      </form>
    </div>
  );
}
