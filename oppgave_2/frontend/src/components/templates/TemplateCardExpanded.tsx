'use client';

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
import DeleteTemplateButton from "./DeleteTemplateButton";
import { checkExistingActiveEvents } from "@/lib/services/activeEvents";
import EditTemplateButton from "./EditTemplateButton";
import { validateEventData, hasValidationErrors } from "../../util/validation";

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

  const [validationErrors, setValidationErrors] = useState<Record<string, string | null>>({});
  const [error, setError] = useState<string | null>(null);
  const rules = applyRules(initialRules || eventData.rules!);
  const { addEvent, loading: createEventLoading, error: createEventError } = useCreateEvent();
  const { createActiveEvent, loading: createActiveEventLoading, error: createActiveEventError } = useCreateActiveEvent();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }
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

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
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

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (input.value === "0") {
      input.value = "";
    }
  };

  {/* SRC: kilde: chatgpt.com  || Brukt gpt når vi ikke klarte å få til submmitt av formfield når vi har to stykk submit-knapper til et og samme formfield. Vi har gjort endringer frem og tilbake og samarbeidet med gpt for å få det til å fungere */}
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, action: string) => {
    e.preventDefault();
    setError(null);

    const validationResults = validateEventData(eventData);
    setValidationErrors(validationResults);

    if (hasValidationErrors(validationResults)) {
      return;
    }

    try {
      if (action === "addTemplate") {
        const eventResult = await addEvent(eventData);
        if (!eventResult.success) {
          setError(eventResult.error?.message || "Kunne ikke opprette arrangement");
          return;
        }

        const templateResponse = await onAddTemplate({ event_id: eventData.slug });
        if (templateResponse) {
          setEventData(eventData);
          router.push(`/templates`);
        } else {
          setError("Kunne ikke opprette mal");
        }
      } else if (action === "addEvent") {
        if (template_id && initialRules?.allow_multiple_events_same_day === "false") {
          const hasExistingEvent = await checkExistingActiveEvents(template_id, eventData.date);
          
          if (hasExistingEvent) {
            setError("Det finnes allerede et arrangement med denne malen på valgt dato.");
            return;
          }
        }

        const eventResult = await addEvent(eventData);
        if (!eventResult.success) {
          setError(eventResult.error?.message || "Kunne ikke opprette arrangement");
          return;
        }

        if (template_id) {
          try {
            const activeEventResult = await createActiveEvent(eventData.slug, template_id);
            if (!activeEventResult) {
              setError("Kunne ikke aktivere arrangement");
              return;
            }
            
            setEventData(eventData);
            router.push(`/events/${eventData.slug}`);
          } catch (error) {
            setError("Feil ved aktivering av arrangement");
            return;
          }
        } else {
          setEventData(eventData);
          router.push(`/events/${eventData.slug}`);
        }
      }
    } catch (error) {
      setError("Feil ved håndtering av skjema");
    }
  };

  const inputClasses = "mt-2 block w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const errorClasses = "text-red-500 text-sm mt-1";
  const numberInputClasses = `${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none relative pr-12`;

  const getErrorMessage = () => {
    if (error) {
      return error;
    }
    if (createEventError) {
      return createEventError;
    }
    if (createActiveEventError) {
      return createActiveEventError;
    }
    return null;
  };

  {/* SRC: kilde: chatgpt.com  || Tailwind laget med gpt, mens annet er laget med gpt for å forbedre kode. Vi har også gjort endringer frem og tilbake på hva gpt prøvde å fikse */}
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-indigo-500">
      <form onSubmit={(e) => handleSubmit(e, (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") as string)} className="space-y-6">
      <div className="flex justify-between items-center pb-2">
        <div className="border-b border-slate-200 pb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Mal for {title}</h2>
          <p className="mt-2 text-slate-600">Tilpass malen etter dine behov</p>
        </div>
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
                <input
                  type="date"
                  name="date"
                  value={eventData.date || ""}
                  onChange={handleDateChange}
                  className={`${inputClasses} ${validationErrors.date ? 'border-red-500' : ''}`}
                  required
                />
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
                value={eventData.event_type || event_type}
                onChange={handleChange}
                className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${validationErrors.event_type ? 'border-red-500' : ''}`}
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
                      onClick={() => handleChange({ target: { name: 'total_slots', value: String(eventData.total_slots + 1) } })}
                      className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center border-b border-slate-300 rounded-tr-lg"
                      disabled={rules.shouldDisableSize}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'total_slots', value: String(Math.max(0, eventData.total_slots - 1)) } })}
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
                      onClick={() => handleChange({ target: { name: 'price', value: String(eventData.price + 1) } })}
                      className="flex-1 px-3 hover:bg-slate-50 flex items-center justify-center border-b border-slate-300 rounded-tr-lg"
                      disabled={rules.shouldDisablePrice}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange({ target: { name: 'price', value: String(Math.max(0, eventData.price - 1)) } })}
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

        {getErrorMessage() && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p>{getErrorMessage()}</p>
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t border-slate-200">
          <DeleteTemplateButton templateId={id}/>
          
          <EditTemplateButton eventData={eventData}/>

          <button
            name="action"
            value="addEvent"
            type="submit"
            disabled={createEventLoading || createActiveEventLoading}
            className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-400 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
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
        </div>
      </form>
    </div>
  );
}
