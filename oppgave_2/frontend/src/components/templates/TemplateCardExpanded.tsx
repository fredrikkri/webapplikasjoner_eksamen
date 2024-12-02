import { onAddActiveEvent } from "@/lib/services/activeEvents";
import { FormEvent, useState, useRef, useEffect } from "react";
import { Event as EventData } from "../../types/Event";
import { onAddTemplate } from "@/lib/services/templates";
import { useCreateEvent } from "@/hooks/useEvent";
import { useRouter } from "next/navigation";
import { Rules } from "@/types/Rules";
import { BASE_URL, BASE_WEB, ENDPOINTS } from "@/config/config";

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
  price: number;
  rules?: Rules;
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

export default function TemplateCardExpanded({
  slug, 
  title, 
  description, 
  date, 
  location, 
  event_type, 
  total_slots, 
  available_slots, 
  price,
  rules
}: TemplateCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    rules?.restricted_days ? rules.restricted_days.split(',') : []
  );
  const [eventData, setEventData] = useState<EventData>({
    id: crypto.randomUUID(),
    title: title,
    description: description,
    date: date,
    location: location,
    slug: generateSlug(title),
    event_type: event_type,
    total_slots: total_slots,
    available_slots: available_slots,
    price: price,
    rules: rules || {
      is_private: "false",
      restricted_days: null,
      allow_multiple_events_same_day: "true",
      waitlist: "true",
      fixed_price: "false",
      fixed_size: "false",
      is_free: "false"
    }
  });

  const daysOfWeek = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { addEvent, loading, error } = useCreateEvent();
  const router = useRouter();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();

    try {
      if (action === "addTemplate") {
        await addEvent(eventData);
        const templateResponse = await onAddTemplate({ event_id: eventData.slug });
  
        if (templateResponse) {
          setEventData(eventData);
          router.push(`/templates`);
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

  const inputClasses = "mt-2 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const selectClasses = "ml-3 block w-24 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
      <form onSubmit={(e) => handleSubmit(e, (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") as string)} className="space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Mal for {title}</h2>
          <p className="mt-2 text-slate-600">Tilpass malen etter dine behov</p>
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
                value={eventData.event_type || event_type}
                onChange={handleChange}
                className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_0.5rem_center] bg-no-repeat pr-10`}
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
                title="e"
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
                  <label className="text-sm font-medium text-slate-700">Tillat flere arrangementer samme dag</label>
                  <p className="text-sm text-slate-500">Deltakere kan melde seg på flere arrangementer på samme dato</p>
                </div>
                <select
                title="e"
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
                title="e"
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
                  <p className="text-sm text-slate-500">Velg dager hvor påmelding ikke er tillatt</p>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`${selectClasses} bg-white border w-36 border-gray-300 ${isDropdownOpen ? 'border-indigo-500 w-36 ring-1 ring-indigo-500' : ''}`}
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleDayToggle(day);
                            }}
                          >
                            <input
                            title="e"
                              type="checkbox"
                              checked={selectedDays.includes(day)}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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

        {eventData.rules?.is_private === "true" && (
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Custom URL</label>
              <div className="flex items-center gap-2 mt-1">
      <input
      placeholder="e"
        type="text"
        value={`http://localhost:4000/events/${eventData.slug || "slug-not-available"}`}
        readOnly
        className="px-3 py-2 border rounded-md text-sm text-slate-700 bg-slate-50 border-slate-300 focus:outline-none focus:ring focus:ring-slate-200"
      />
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(`${BASE_WEB}${eventData.slug || "slug-not-available"}`)}
        className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Copy
      </button>
    </div>
    <p className="text-xs text-slate-500 mt-1">
      Del denne lenken med dine inviterte deltakere.
    </p>
  </div>
)}

        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <button
            name="action"
            value="addTemplate"
            type="submit"
            className="w-2/5 inline-flex justify-center items-center px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Lagre som ny mal
          </button>

          <button
            name="action"
            value="addEvent"
            type="submit"
            className="w-3/5 inline-flex justify-center items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Start Arrangement
          </button>
        </div>
      </form>
    </div>
  );
}
