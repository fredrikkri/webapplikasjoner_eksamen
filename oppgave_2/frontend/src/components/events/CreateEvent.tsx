"use client";
import React, { FormEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Event as EventData } from "../../types/Event";
import { useCreateEvent } from "../../hooks/useEvent";
import { onAddTemplate } from "../../lib/services/templates";
import { onAddActiveEvent } from "../../lib/services/activeEvents";
import { Rules } from "../../types/Rules";
import { applyRules } from "../../lib/services/rules";
import { validateEventData, hasValidationErrors } from "../../util/validation";

// SRC: kilde: chatgpt.com  / med endringer
const CreateEvent: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
  const [eventData, setEventData] = useState<Omit<EventData, 'id'>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    slug: '',
    event_type: '',
    total_slots: 0,
    available_slots: 0,
    price: 0,
    rules: {
      is_private: "false",
      restricted_days: null,
      allow_multiple_events_same_day: "true",
      waitlist: "true",
      fixed_price: "false",
      fixed_size: "false",
      is_free: "false"
    }
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const daysOfWeek = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

  const rules = applyRules(eventData.rules!);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (eventData.rules?.is_free === "true") {
      setEventData(prev => ({
        ...prev,
        price: 0
      }));
    }
  }, [eventData.rules?.is_free]);

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('rules.')) {
      const ruleKey = name.split('.')[1];
      setEventData((prevData) => ({
        ...prevData,
        rules: {
          ...prevData.rules!,
          [ruleKey]: value
        }
      }));
    } else {
      setEventData((prevData) => ({
        ...prevData,
        [name]: name === "total_slots" || name === "available_slots" || name === "price" 
          ? Number(value)
          : value,
        slug: name === "title" ? generateSlug(value) : prevData.slug,
        available_slots: name === "available_slots" ? 0 : prevData.total_slots,
      }));
    }

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

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      const newDays = prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day];
      
      setEventData(prevData => ({
        ...prevData,
        rules: {
          ...prevData.rules!,
          restricted_days: newDays.length > 0 ? newDays.join(',') : null
        }
      }));

      return newDays;
    });
  };

  // SRC: kilde: chatgpt.com  / med endringer
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();

    const validationResults = validateEventData(eventData);
    setValidationErrors(validationResults);

    if (hasValidationErrors(validationResults)) {
      return;
    }

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!rules.isDateAllowed(date)) {
      alert('Denne datoen er ikke tillatt basert på valgte restriksjoner.');
      return;
    }
    handleChange(e);
  };

  const inputClasses = "mt-2 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-200";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const selectClasses = "ml-3 block w-24 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm";
  const errorClasses = "text-red-500 text-sm mt-1";
  const numberInputClasses = `${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative pr-12`;
  const dateInputClasses = `${inputClasses} cursor-pointer`;

  // SRC: kilde: chatgpt.com  / med endringer
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={(e) => handleSubmit(e, (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") as string)} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-900">Opprett et nytt arrangement</h2>
          <p className="mt-2 text-teal-600">Fyll ut skjemaet under for å opprette et nytt arrangement</p>
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
                className={`${inputClasses} ${validationErrors.title ? 'border-red-500' : ''}`}
                required
                placeholder="Skriv inn arrangementets tittel"
              />
            </label>
            {validationErrors.title && <p className={errorClasses}>{validationErrors.title}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              Beskrivelse
              <textarea
                name="description"
                value={eventData.description || ""}
                onChange={handleChange}
                className={`${inputClasses} h-32 resize-none ${validationErrors.description ? 'border-red-500' : ''}`}
                required
                placeholder="Beskriv arrangementet"
              />
            </label>
            {validationErrors.description && <p className={errorClasses}>{validationErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Dato
                <div className="relative" onClick={() => document.querySelector<HTMLInputElement>('input[name="date"]')?.showPicker()}>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleDateChange}
                    className={`${dateInputClasses} ${validationErrors.date ? 'border-red-500' : ''}`}
                    required
                    lang="nb"
                  />
                </div>
              </label>
              {validationErrors.date && <p className={errorClasses}>{validationErrors.date}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                Lokasjon
                <input
                  type="text"
                  name="location"
                  value={eventData.location || ""}
                  onChange={handleChange}
                  className={`${inputClasses} ${validationErrors.location ? 'border-red-500' : ''}`}
                  required
                  placeholder="Hvor skal arrangementet holdes?"
                />
              </label>
              {validationErrors.location && <p className={errorClasses}>{validationErrors.location}</p>}
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              Kategori
              <select
                name="event_type"
                value={eventData.event_type || ""}
                onChange={handleChange}
                className={`${inputClasses} ${validationErrors.event_type ? 'border-red-500' : ''}`}
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
            {validationErrors.event_type && <p className={errorClasses}>{validationErrors.event_type}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>
                Antall plasser
                <div className="relative">
                  <input
                    type="number"
                    name="total_slots"
                    value={eventData.total_slots}
                    onChange={handleChange}
                    onKeyDown={handleNumberInput}
                    className={`${numberInputClasses} ${validationErrors.total_slots ? 'border-red-500' : ''}`}
                    required
                    min="0"
                    disabled={rules.shouldDisableSize}
                  />
                  <div className="absolute right-0 inset-y-0 flex flex-col border-l border-slate-300">
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'total_slots', value: String(eventData.total_slots + 1) } } as any)}
                      className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center border-b border-slate-300 rounded-tr-lg"
                      disabled={rules.shouldDisableSize}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'total_slots', value: String(Math.max(0, eventData.total_slots - 1)) } } as any)}
                      className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center rounded-br-lg"
                      disabled={rules.shouldDisableSize}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </label>
              {validationErrors.total_slots && <p className={errorClasses}>{validationErrors.total_slots}</p>}
            </div>

            <div>
              <label className={labelClasses}>
                Pris (NOK)
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    onKeyDown={handleNumberInput}
                    className={`${numberInputClasses} ${validationErrors.price ? 'border-red-500' : ''}`}
                    required
                    min="0"
                    disabled={rules.shouldDisablePrice}
                  />
                  <div className="absolute right-0 inset-y-0 flex flex-col border-l border-slate-300">
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'price', value: String(eventData.price + 1) } } as any)}
                      className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center border-b border-slate-300 rounded-tr-lg"
                      disabled={rules.shouldDisablePrice}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'price', value: String(Math.max(0, eventData.price - 1)) } } as any)}
                      className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center rounded-br-lg"
                      disabled={rules.shouldDisablePrice}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </label>
              {validationErrors.price && <p className={errorClasses}>{validationErrors.price}</p>}
            </div>
          </div>

          {/* Rules Section */}
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Regler for arrangementet</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Privat arrangement</label>
                  <p className="text-sm text-slate-500">Kun for inviterte deltakere</p>
                </div>
                <select
                  name="rules.is_private"
                  value={eventData.rules?.is_private || "false"}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="false">Nei</option>
                  <option value="true">Ja</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Fast pris</label>
                  <p className="text-sm text-slate-500">Prisen kan ikke endres etter opprettelse</p>
                </div>
                <select
                  name="rules.fixed_price"
                  value={eventData.rules?.fixed_price || "false"}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="false">Nei</option>
                  <option value="true">Ja</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Fast størrelse</label>
                  <p className="text-sm text-slate-500">Antall plasser kan ikke endres etter opprettelse</p>
                </div>
                <select
                  name="rules.fixed_size"
                  value={eventData.rules?.fixed_size || "false"}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="false">Nei</option>
                  <option value="true">Ja</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Gratis arrangement</label>
                  <p className="text-sm text-slate-500">Arrangementet er gratis for alle deltakere</p>
                </div>
                <select
                  name="rules.is_free"
                  value={eventData.rules?.is_free || "false"}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="false">Nei</option>
                  <option value="true">Ja</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Tillat flere arrangementer samme dag</label>
                  <p className="text-sm text-slate-500">Deltakere kan melde seg på flere arrangementer på samme dato</p>
                </div>
                <select
                  name="rules.allow_multiple_events_same_day"
                  value={eventData.rules?.allow_multiple_events_same_day || "true"}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="true">Ja</option>
                  <option value="false">Nei</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Aktiver venteliste</label>
                  <p className="text-sm text-slate-500">Tillat påmelding til venteliste når arrangementet er fullt</p>
                </div>
                <select
                  name="rules.waitlist"
                  value={eventData.rules?.waitlist || "true"}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="false">Nei</option>
                  <option value="true">Ja</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Begrensede dager</label>
                  <p className="text-sm text-slate-500">Velg tillatte dager for arrangementet</p>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`${selectClasses} bg-white border w-36 border-gray-300 ${isDropdownOpen ? 'border-teal-500 w-36 ring-1 ring-teal-500' : ''}`}
                  >
                    <span className="block truncate">
                      {selectedDays.length === 0 ? 'Velg Dager' : `${selectedDays.length} valgt`}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                      {daysOfWeek.map((day) => (
                          <div
                            key={day}
                            className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer"
                            onClick={() => handleDayToggle(day)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(day)}
                              readOnly
                              className={`h-4 w-4 rounded border-gray-300 ${
                                selectedDays.includes(day)
                                  ? 'bg-teal-600 border-teal-600'
                                  : 'bg-white'
                              } cursor-pointer`}
                            />
                            <span className="ml-3 text-sm text-gray-700">{day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            name="action"
            value="addTemplate"
            type="submit"
            className="w-2/5 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 transform hover:-translate-y-0.5 active:translate-y-0"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Lagre som mal
          </button>

          <button
            name="action"
            value="addEvent"
            type="submit"
            className="w-3/5 flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transform hover:-translate-y-0.5 active:translate-y-0"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Opprett Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
