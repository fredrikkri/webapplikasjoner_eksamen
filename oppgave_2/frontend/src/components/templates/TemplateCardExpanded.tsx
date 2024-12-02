import { FormEvent, useState } from "react";
import { Event as EventData } from "../../types/Event";
import { onAddTemplate } from "@/lib/services/templates";
import { useCreateEvent } from "@/hooks/useEvent";
import { useRouter } from "next/navigation";
import { Rules } from "@/types/Rules";
import { BASE_WEB } from "@/config/config";
import { applyRules } from "@/lib/services/rules";
import RuleItem from "./RuleItem";
import { useCreateActiveEvent } from "@/hooks/useActiveEvent";

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
  template_id?: number;
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
  id,
  slug, 
  title, 
  description, 
  date, 
  location, 
  event_type, 
  total_slots, 
  available_slots, 
  price,
  rules: initialRules,
  template_id
}: TemplateCardProps) {
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
    rules: initialRules || {
      is_private: "false",
      restricted_days: null,
      allow_multiple_events_same_day: "true",
      waitlist: "true",
      fixed_price: "false",
      fixed_size: "false",
      is_free: "false"
    }
  });

  const rules = applyRules(initialRules || eventData.rules!);
  const { addEvent, loading: createEventLoading, error: createEventError } = useCreateEvent();
  const { createActiveEvent, loading: createActiveEventLoading, error: createActiveEventError } = useCreateActiveEvent();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setEventData((prevData) => ({
      ...prevData,
      [name]: name === "total_slots" || name === "available_slots" || name === "price" 
        ? Number(value) 
        : value,
      slug: name === "title" ? generateSlug(value) : prevData.slug,
      available_slots: name === "available_slots" ? 0 : prevData.total_slots,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!rules.isDateAllowed(date)) {
      alert('Denne datoen er ikke tillatt basert på valgte restriksjoner.');
      return;
    }
    handleChange(e);
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value === "0") {
      input.value = "";
    }
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
        console.log('Creating event with data:', eventData);
        await addEvent(eventData);
        
        // Use template_id instead of id
        console.log('Creating active event with template ID:', template_id);
        console.log('Event slug:', eventData.slug);
        
        try {
          const activeEventResponse = await createActiveEvent(eventData.slug, template_id);
          console.log('Active event response:', activeEventResponse);
          if(activeEventResponse){
            setEventData(eventData);
            router.push(`/events/${eventData.slug}`);
          }
        } catch (error) {
          console.error('Error creating active event:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const inputClasses = "mt-2 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
      <form onSubmit={(e) => handleSubmit(e, (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") as string)} className="space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Mal for {title}</h2>
          <p className="mt-2 text-slate-600">Tilpass malen etter dine behov</p>
        </div>

        {(createEventError || createActiveEventError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p>{createEventError?.message || createActiveEventError?.message}</p>
          </div>
        )}

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
                  onChange={handleDateChange}
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
                  value={eventData.total_slots}
                  onChange={handleChange}
                  onKeyDown={handleNumberInput}
                  className={inputClasses}
                  required
                  min="0"
                  disabled={rules.shouldDisableSize}
                />
              </label>
            </div>

            <div>
              <label className={labelClasses}>
                Pris (NOK)
                <input
                  type="number"
                  name="price"
                  value={eventData.price}
                  onChange={handleChange}
                  onKeyDown={handleNumberInput}
                  className={inputClasses}
                  required
                  min="0"
                  disabled={rules.shouldDisablePrice}
                />
              </label>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Regler for malen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RuleItem 
                label="Privat arrangement"
                description="Kun for inviterte deltakere"
                value={initialRules?.is_private || "false"}
              />
              <RuleItem 
                label="Fast pris"
                description="Prisen kan ikke endres etter opprettelse"
                value={initialRules?.fixed_price || "false"}
              />
              <RuleItem 
                label="Fast størrelse"
                description="Antall plasser kan ikke endres etter opprettelse"
                value={initialRules?.fixed_size || "false"}
              />
              <RuleItem 
                label="Gratis arrangement"
                description="Arrangementet er gratis for alle deltakere"
                value={initialRules?.is_free || "false"}
              />
              <RuleItem 
                label="Flere arrangementer samme dag"
                description="Tillat påmelding til flere arrangementer på samme dato"
                value={initialRules?.allow_multiple_events_same_day || "true"}
              />
              <RuleItem 
                label="Venteliste"
                description="Tillat påmelding til venteliste når fullt"
                value={initialRules?.waitlist || "true"}
              />
              <div className="md:col-span-2">
                <RuleItem 
                  label="Tillatte dager"
                  description="Dager arrangementet kan holdes"
                  value={initialRules?.restricted_days || null}
                />
              </div>
            </div>
          </div>
        </div>

        {eventData.rules?.is_private === "true" && (
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Custom URL</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={`${BASE_WEB}${eventData.slug || "slug-not-available"}`}
                  readOnly
                  className="px-3 py-2 border rounded-md text-sm text-slate-700 bg-slate-50 border-slate-300 focus:outline-none focus:ring focus:ring-slate-200 w-full"
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

<div className="w-full flex flex-col gap-6 p-6">
  <button
    name="action"
    value="addEvent"
    type="submit"
    disabled={createEventLoading || createActiveEventLoading}
    className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-semibold py-4 px-6 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-400"
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
    {createActiveEventLoading ? 'Starter...' : 'Start Arrangement'}
  </button>
  <div className="flex gap-6">

    <button
      name="action"
      value="addTemplate"
      type="submit"
      disabled={createEventLoading}
      className="w-1/2 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400"
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
          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
        />
      </svg>
      {createEventLoading ? 'Lagrer...' : 'Lagre som ny mal'}
    </button>

    <button
      className="w-1/2 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-400"
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
          d="M15 12H9m6 0H9m6 0a3 3 0 00-6 0m6 0a3 3 0 01-6 0m0-6.414L12 3m0 0L9.293 5.707M12 3l2.707 2.707"
        />
      </svg>
      Rediger Mal
    </button>
  </div>
</div>

      </form>
    </div>
  );
}
