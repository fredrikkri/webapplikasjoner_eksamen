import { useAllRegistrationsMembersByEventId, useCreateRegistration } from "@/hooks/useRegistration";
import { getWaitListByEventId, useCreateWaitlistRegistration } from "../../hooks/useWaitlistRegistration";
import { useState } from "react";
import { Registration as RegistrationType } from "@/types/Registration";
import Link from "next/link";
import { Rules } from "@/types/Rules";

type EventCardProps = {
  id: string,
  title: string;
  description: string;
  date: string;
  location: string;
  slug: string;
  event_type: string;
  total_slots: number;
  available_slots: number;
  price: number;
  rules?: Rules
};

export default function EventCardExpanded({
  id,
  title,
  description,
  slug,
  date,
  location,
  event_type,
  total_slots,
  available_slots,
  price,
  rules
}: EventCardProps) {
  const [availableSlots, setAvailableSlots] = useState<number>(available_slots);
  const { addWaitlistRegistration } = useCreateWaitlistRegistration();
  const { waitlist: fetchedWaitlist} = getWaitListByEventId(id);
  const { registrationMembers, loading, error } = useAllRegistrationsMembersByEventId(id)
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  let totalSizeWaitlist = availableSlots;

  if(fetchedWaitlist){
    let total = totalSizeWaitlist-fetchedWaitlist.length;

    totalSizeWaitlist = total
    if(totalSizeWaitlist < 0){totalSizeWaitlist=0}
  }
  if(registrationMembers){
    let total = totalSizeWaitlist-registrationMembers.length;

    totalSizeWaitlist = total
    if(totalSizeWaitlist < 0){totalSizeWaitlist=0}
  }


  const [registrations, setRegistrations] = useState<RegistrationType[]>([
    { id: crypto.randomUUID(), event_id: slug, email: "", has_paid: "false", registration_date: "", order_id: "" , responsible_person: "", number_of_people: 0},
  ]);

  const [waitlist, setwaitlist] = useState<RegistrationType[]>([
    { id: crypto.randomUUID(), event_id: slug, email: "", has_paid: "false", registration_date: "", order_id: "", responsible_person: "", number_of_people: 0},
  ]);

  // SRC: kilde: chatgpt.com
  const handleAddEmailField = () => {
    setRegistrations([
      ...registrations,
      { id: crypto.randomUUID(), event_id: slug, email: "", has_paid: "false", registration_date: "", order_id: "" , responsible_person: "", number_of_people: 0},
    ]);
  };

  // SRC: kilde: chatgpt.com
  const handleRemoveEmailField = (index: number) => {
    const updatedRegistrations = registrations.filter((_, i) => i !== index);
    setRegistrations(updatedRegistrations);
  };

  // SRC: kilde: chatgpt.com / med endringer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value, checked } = e.target;
    const updatedRegistrations = [...registrations];

    if (name === "email") {
      updatedRegistrations[index].email = value;
    } else if (name === "has_paid") {
      updatedRegistrations[index].has_paid = checked ? "true" : "false";
    }

    setRegistrations(updatedRegistrations);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const current_order_id = crypto.randomUUID();
    if(registrations.length > totalSizeWaitlist && rules?.waitlist === "false"){
      setPopupMessage("Du har valg for mange folk, det er kun "+totalSizeWaitlist+ " ledige plasser og ingen venteliste");
      setShowPopup(true);
      return
    }

    const registrationData = registrations.map(({ id, email, has_paid, event_id, registration_date, responsible_person, number_of_people }) => ({
      id,
      event_id,
      email,
      has_paid,
      registration_date,
      order_id: current_order_id,
      responsible_person,
      number_of_people
    }));

    for (const registration of registrationData) {
      await addWaitlistRegistration(registration);
    }

    window.history.go()
  }

  return (
    <article className="bg-white rounded-xl shadow-lg border-l-4 border-teal-500">
      <div className="p-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-600 mb-4">{description}</p>
          </div>
          <Link href={`/events/${slug}/admin`}>
            <button type="button" className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Administrer
            </button>
          </Link>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(date).toLocaleDateString("no-NO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{event_type}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Totalt {total_slots} plasser ({totalSizeWaitlist} ledige)</span>
            </div>
            <div className="flex items-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{price} kr</span>
            </div>
          </div>
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
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Registrer deltakere</h3>
            <div className="space-y-4">
              {registrations.map((registration, index) => (
                <div key={registration.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      value={registration.email}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="E-postadresse"
                      required
                    />
                    <div className="flex items-center space-x-3">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="has_paid"
                          checked={registration.has_paid === "true"}
                          onChange={(e) => handleChange(e, index)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">Betalt?</span>
                      </label>
                      {registrations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEmailField(index)}
                          className="inline-flex items-center px-3 py-1 text-sm text-red-700 hover:text-red-800 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Fjern
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleAddEmailField}
              className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Legg til flere personer
            </button>
            <button
  type="submit"
  className="inline-flex items-center px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
  {rules && rules.waitlist === "true" && totalSizeWaitlist < registrations.length
    ? "Legg til i venteliste" 
    : "Registrer påmelding(er) og betal"}
</button>
          </div>
        </form>
      </div>
    </article>
  );
}
