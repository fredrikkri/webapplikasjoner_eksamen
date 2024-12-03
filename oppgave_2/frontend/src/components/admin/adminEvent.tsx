import { useState } from "react";
import { deleteRegistrationById, useAllRegistrations, useCreateRegistration } from "@/hooks/useRegistration";
import { Event } from "@/types/Event";
import { RegistrationEventData } from "@/types/Registration";
import { createId } from "@/util/utils";
import { validateEmail } from "@/util/validation";
import EditEventButton from "./editEventButton";
import { updateAvailableSlots } from "../../lib/services/events";
import DeleteEventButton from "./deleteEventButton";

interface RegCardProps {
  event: Event | null;
}

export default function AdminEvent(props: RegCardProps) {
  const { event } = props;
  const { events, loading, error, refetch } = useAllRegistrations();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState<{ email: string }[]>([]);
  const { addRegistration } = useCreateRegistration();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<number, string | null>>({});

  let totalSpace = 0;

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-slate-50 rounded-xl border-2 border-slate-200">
        <p className="text-slate-600 text-lg font-medium">Laster arrangement data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  const filteredRegistrations = events?.filter(
    (registration) => registration.event_id === event.id
  );

  if(filteredRegistrations && event){
    totalSpace = event?.available_slots;
  }

  const toggleDropdown = () => {
    setOpenDropdown((prev) => !prev);
  };

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddRegistrationField = () => {
    setNewRegistrations((prev) => [...prev, { email: "" }]);
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedRegistrations = [...newRegistrations];
    updatedRegistrations[index] = { ...updatedRegistrations[index], [field]: value };
    setNewRegistrations(updatedRegistrations);

    setValidationErrors(prev => ({
      ...prev,
      [index]: null
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newValidationErrors: Record<number, string | null> = {};
    let hasErrors = false;

    newRegistrations.forEach((registration, index) => {
      const emailError = validateEmail(registration.email);
      if (emailError) {
        newValidationErrors[index] = emailError;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(newValidationErrors);
      return;
    }

    if(totalSpace < newRegistrations.length){
      setPopupMessage("Du har valgt for mange folk, det er kun "+totalSpace+ " ledige plass.");
      setShowPopup(true);
      return;
    }

    const registrationData = newRegistrations.map(({ email }) => ({
        id: createId(),
        email,
        event_id: event.id,
        registration_date: new Date().toISOString(),
        has_paid: "false",
        order_id: createId()
    }));

    if(totalSpace < registrationData.length){
      setPopupMessage("Du har valgt for mange folk, det er kun "+totalSpace+ " ledige plass.");
      setShowPopup(true);
      return;
    }

    try {
      await addRegistration(registrationData);
      await refetch();
      await updateAvailableSlots(event.id, event.available_slots-registrationData.length)
      setNewRegistrations([]);
      setValidationErrors({});
      setOpenForm(false);
    } catch (error) {
      console.error("Failed to add registration:", error);
      setPopupMessage("Det oppstod en feil ved registrering av deltakere.");
      setShowPopup(true);
    }
  };

  const handleRemoveRegistrationField = (index: number) => {
    const updatedRegistrations = [...newRegistrations];
    updatedRegistrations.splice(index, 1);
    setNewRegistrations(updatedRegistrations);

    const updatedErrors = { ...validationErrors };
    delete updatedErrors[index];
    setValidationErrors(updatedErrors);
  };

  const handleRemovePerson = async (registrationId: string) => {
    try {
      await deleteRegistrationById(registrationId);
      await updateAvailableSlots(event.id, event.available_slots+1)
      await refetch();
    } catch (error) {
      console.error("Failed to remove registration:", error);
      setPopupMessage("Det oppstod en feil ved fjerning av deltaker.");
      setShowPopup(true);
    }
  };

  // SRC: kilde: chatgpt.com  / Tailwind er laget med gpt
  return (
    <article className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900">Administrering</h2>
        <p className="mt-2 text-blue-600">Her kan du håndtere påmeldinger og arrangement</p>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          <p className="text-blue-50">{event.description}</p>
        </div>

        <div className="border-b border-slate-200 flex space-x-2 justify-end">
          <EditEventButton event={event} />
          <DeleteEventButton event={event} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Totalt antall plasser</p>
                <p className="text-lg font-semibold text-slate-900">{event.total_slots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Ledige plasser</p>
                <p className="text-lg font-semibold text-slate-900">
                {event.total_slots - (filteredRegistrations?.length || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600">Pris per person</p>
                <p className="text-lg font-semibold text-slate-900">{event.price} kr</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-between px-6 py-4 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 border border-slate-200 shadow-sm"
            onClick={toggleDropdown}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {openDropdown ? "Lukk påmeldingsliste" : "Vis påmeldingsliste"}
            </span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${openDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openDropdown && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-[calc(100%-4rem)]">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Påmeldte deltakere</h3>
              <p className="text-sm text-slate-600 mt-1">Oversikt over alle registrerte deltakere</p>
            </div>

            <div className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto">
              {filteredRegistrations?.map((registration: RegistrationEventData) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors duration-150"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{registration.email}</p>
                      <p className="text-sm text-slate-500">Registrert: {new Date(registration.registration_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemovePerson(registration.id)}
                    className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 focus:outline-none transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Fjern
                  </button>
                </div>
              ))}

              {(!filteredRegistrations || filteredRegistrations.length === 0) && (
                <div className="p-6 text-center text-slate-600">
                  Ingen påmeldte deltakere enda
                </div>
              )}
            </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-between px-6 py-4 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 border border-slate-200 shadow-sm"
            onClick={toggleForm}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {openForm ? "Lukk manuell registrering" : "Vis manuell registrering"}
            </span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${openForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openForm && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden h-[calc(100%-4rem)]">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Manuell registrering</h3>
              <p className="text-sm text-slate-600 mt-1">Legg til nye deltakere manuelt</p>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              {newRegistrations.map((registration, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      E-postadresse
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={registration.email}
                        onChange={(e) => handleInputChange(index, "email", e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          validationErrors[index]
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="navn@example.com"
                        required
                      />
                    </div>
                    {validationErrors[index] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[index]}</p>
                    )}
                  </div>

                  {newRegistrations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRegistrationField(index)}
                      className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 focus:outline-none transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Fjern deltaker
                    </button>
                  )}
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleAddRegistrationField}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Legg til flere personer
                </button>

                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Registrer deltakere
                </button>
              </div>
            </form>
            </div>
          )}
        </div>
      </div>
      
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold">Feil</h3>
            </div>
            <p className="text-slate-600 mb-6">{popupMessage}</p>
            <button
              onClick={handleClosePopup}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
