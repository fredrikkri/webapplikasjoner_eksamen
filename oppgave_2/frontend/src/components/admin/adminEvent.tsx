import { useState } from "react";
import { deleteRegistrationById, useAllRegistrations, useCreateRegistration } from "@/hooks/useRegistration";
import { Event } from "@/types/Event";
import { Registration, RegistrationEventData } from "@/types/Registration";
import crypto from "crypto"; // If you're using Node.js for crypto (otherwise skip this line)
import { createId } from "@/util/utils";

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

  const toggleDropdown = () => {
    setOpenDropdown((prev) => !prev);
  };

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };

  const handleAddRegistrationField = () => {
    setNewRegistrations((prev) => [...prev, { email: "" }]);
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedRegistrations = [...newRegistrations];
    updatedRegistrations[index] = { ...updatedRegistrations[index], [field]: value };
    setNewRegistrations(updatedRegistrations);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const registrationData = newRegistrations.map(({ email }) => ({
        id: createId(),
        email,
        event_id: event.id,
        registration_date: new Date().toISOString(),
        has_paid: "false",
        order_id: createId()
    }));

    console.log("Form submitted with new registrations:", registrationData);
    await addRegistration(registrationData)
    setNewRegistrations([]);
  };

  const handleRemoveRegistrationField = (index: number) => {
    const updatedRegistrations = [...newRegistrations];
    updatedRegistrations.splice(index, 1);
    setNewRegistrations(updatedRegistrations);
  };

  const handleRemovePerson = async (registrationId: string) => {
    try {
        await deleteRegistrationById(registrationId);

    } catch (error) {
      console.error("Failed to remove registration:", error);
    } finally {
    }
  };
  


  return (
    <article className="p-6 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {/* Render the event details */}
        <h2 className="text-2xl font-semibold text-gray-900">{event.title}</h2>
        <p className="text-sm text-gray-600 mt-2">{event.description}</p>

        {/* Render the registrations */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900">Registrations</h3>
          {filteredRegistrations?.length === 0 ? (
            <p>No registrations found for this event.</p>
          ) : (
            <ul className="space-y-4 mt-4">
              <li className="flex justify-between items-center p-4 bg-slate-50 rounded-lg shadow-sm hover:bg-slate-100">
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800">Administrer påmeldinger</p>
                </div>
                <button
                  className="text-sm text-blue-600 focus:outline-none"
                  onClick={toggleDropdown}
                >
                  {openDropdown ? "Hide All" : "View All"}
                </button>
              </li>

              {/* Dropdown to show all responsible persons */}
              {openDropdown && (
                <div className="mt-2 p-4 bg-slate-50 shadow-lg rounded-lg">
                  <p className="font-semibold mb-4">Personer som skal på arrangementet:</p>
                  <ul className="space-y-3">
                    {filteredRegistrations?.map((registration: RegistrationEventData) => (
                      <li
                        key={registration.id}
                        className="flex justify-between items-center text-sm text-gray-700 p-4 bg-white rounded-lg shadow-sm hover:bg-slate-100 transition-all duration-200"
                      >
                        <div>{registration.email}</div>
                                                {/* Aligning the "Remove" button to the right */}
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
              )}
            </ul>
          )}
        </div>

        {/* Button to toggle new registration form */}
        <div className="mt-6">
          <button
            className="flex items-center justify-between w-full px-4 py-2 bg-blue-50 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none"
            onClick={toggleForm}
          >
            <span>{openForm ? "Lukk Manuell Registrering" : "Vis Manuell Registrering"}</span>
          </button>

          {/* Dropdown for new registration form */}
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
                        placeholder="e"
                          type="email"
                          value={registration.email}
                          onChange={(e) => handleInputChange(index, "email", e.target.value)}
                          required
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* Remove specific registration field */}
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
