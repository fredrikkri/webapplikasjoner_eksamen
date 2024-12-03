import { useState } from "react";
import { deleteRegistrationById, useAllRegistrations, useCreateRegistration } from "@/hooks/useRegistration";
import { Event } from "@/types/Event";
import { Registration, RegistrationEventData } from "@/types/Registration";
import { createId } from "@/util/utils";
import { getWaitListByEventId } from "@/hooks/useWaitlistRegistration";
import { validateEmail } from "@/util/validation";

interface RegCardProps {
  event: Event | null;
}

export default function AdminEvent(props: RegCardProps) {
  const { event } = props;
  const { events, loading, error } = useAllRegistrations();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState<{ email: string }[]>([]);
  const { addRegistration } = useCreateRegistration();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<number, string | null>>({});

  let totalSpace = 0;

  if (!event) {
    return <p className="text-center text-gray-600">Loading event data...</p>;
  }

  if (loading) {
    return <p className="text-center text-gray-600">Loading registrations...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error loading registrations: {error.message}</p>;
  }

  const filteredRegistrations = events?.filter(
    (registration) => registration.event_id === event.id
  );

  if(filteredRegistrations && event){
    totalSpace = event?.available_slots-filteredRegistrations?.length
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

    await addRegistration(registrationData);
    setNewRegistrations([]);
    setValidationErrors({});
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
    } catch (error) {
      console.error("Failed to remove registration:", error);
    }
  };

  return (
    <article className="p-6 space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-900">{event.title}</h2>
        <p className="text-base text-gray-600 mt-3">{event.description}</p>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900">Registrations</h3>
          {filteredRegistrations?.length === 0 ? (
            <p>No registrations found for this event.</p>
          ) : (
            <ul className="space-y-4 mt-4">
              <li className="flex" onClick={toggleDropdown}>
                <button
                  className="flex items-center justify-between w-full px-4 py-2 bg-blue-50 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                >
                  {openDropdown ? "Lukk Administrer påmeldinger" : "Vis Administrer påmeldinger"}
                </button>
              </li>

              {openDropdown && (
                <li>
                  <div className="mt-2 p-4 bg-slate-50 shadow-lg rounded-lg">
                    <p className="font-semibold mb-4">Personer som skal på arrangementet:</p>
                    <ul className="space-y-3">
                      {filteredRegistrations?.map((registration: RegistrationEventData) => (
                        <li
                          key={registration.id}
                          className="flex justify-between items-center text-sm text-gray-700 p-4 bg-white rounded-lg shadow-sm hover:bg-slate-100 transition-all duration-200"
                        >
                          <div>{registration.email}</div>
                          <button
                            className="text-red-500 hover:text-red-700 focus:outline-none ml-auto"
                            onClick={() => handleRemovePerson(registration.id)}
                          >
                            Fjern
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <h3 className="text-lg font-semibold text-red-600">{popupMessage}</h3>
              <button
                onClick={handleClosePopup}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            className="flex items-center justify-between w-full px-4 py-2 bg-blue-50 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none"
            onClick={toggleForm}
          >
            <span>{openForm ? "Lukk Manuell Registrering" : "Vis Manuell Registrering"}</span>
          </button>

          {openForm && (
            <div className="mt-4 p-6 bg-slate-50 shadow-lg rounded-lg">
              <form onSubmit={handleFormSubmit}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ny Registrering</h3>
                <div className="space-y-4">
                  {newRegistrations.map((registration, index) => (
                    <div key={index} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={registration.email}
                          onChange={(e) => handleInputChange(index, "email", e.target.value)}
                          required
                          className={`mt-1 block w-full p-2 border rounded-md ${
                            validationErrors[index] 
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                          placeholder="Skriv inn e-postadresse"
                        />
                        {validationErrors[index] && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors[index]}</p>
                        )}
                      </div>

                      <div
                        className="mt-2 text-red-500 cursor-pointer"
                        onClick={() => handleRemoveRegistrationField(index)}
                      >
                        Fjern
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handleAddRegistrationField}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Legg til flere
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Registrer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
