import { useState } from "react";
import { Event } from "@/types/Event";
import { Registration } from "@/types/Registration";
import { useCreateRegistration } from "@/hooks/useRegistration";
import { deleteWaitlistRegistration } from "@/lib/services/waitlistRegistrations";
import { getWaitListByEventId } from "@/hooks/useWaitlistRegistration";

interface RegCardProps {
  event: Event | null;
  waitlist: Registration[] | null;
}

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;
  const { addRegistration, loading, error } = useCreateRegistration();
  const { waitlist: fetchedWaitlist } = getWaitListByEventId(event?.id || "");


  const [selected, setSelected] = useState<Registration[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // SRC: kilde: chatgpt.com  || med endringer /
  const handleSelectRegistration = (registration: Registration) => {
    setSelected((prevSelected) =>
      prevSelected.includes(registration)
        ? prevSelected.filter((item) => item !== registration)
        : [...prevSelected, registration]
    );
  };

  // SRC: kilde: chatgpt.com  || med endringer /
  const handleClickAccept = async (selected: Registration[]) => {
    console.log("Accepted registrations:", selected);
    for (let i = 0; i < selected.length; i++) {
      const registration = selected[i];
      try {
        await addRegistration(registration);
      } catch (error) {
        console.error(`Error accepting registration:`, error);
      }
    }
  };

  // SRC: kilde: chatgpt.com  || med endringer /
  const handleClickDecline = async (selected: Registration[]) => {
    console.log("Declined registrations:", selected);
    for (let i = 0; i < selected.length; i++) {
      const registrationId = selected[i].order_id;
      try {
        await deleteWaitlistRegistration(registrationId);
      } catch (error) {
        console.error(`Error deleting registration ${registrationId}:`, error);
      }
    }
  };

  // SRC: kilde: chatgpt.com /
  const toggleDropdown = (orderId: string) => {
    setOpenDropdown((prev) => (prev === orderId ? null : orderId));
  };

  // SRC: kilde: chatgpt.com  || med endringer /
  const filterRegistrationsByOrderId = (orderId: string) => {
    return fetchedWaitlist?.filter((item) => item.order_id === orderId) || [];
  };

  // SRC: kilde: chatgpt.com  || med endringer /
  if (!event) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-8 text-center max-w-2xl mx-auto">
        <p className="text-lg font-medium text-slate-800">Event not found</p>
      </div>
    );
  }

  // SRC: kilde: chatgpt.com  || med endringer /
  if (!waitlist || waitlist.length === 0) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-8 text-center max-w-2xl mx-auto">
        <p className="text-lg font-medium text-slate-800">No registrations found</p>
      </div>
    );
  }

  // SRC: kilde: chatgpt.com  || med endringer /
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500">
      <div className="p-6">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Registrations for {event.title}</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {waitlist.length} {waitlist.length === 1 ? "registration" : "registrations"}
          </span>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-slate-600">
                <span>Available slots: {event.available_slots}/{event.total_slots}</span>
              </div>
            </div>
          </div>


          <div className="space-y-2">
            <div className="bg-slate-50 rounded-lg p-4">
              {Array.isArray(waitlist) && waitlist.length > 0 ? (
                <ul className="space-y-2">
                  <li className="flex items-center font-semibold text-slate-700 bg-slate-100 p-3 rounded-lg shadow-sm">
                    <span className="flex-1">Order ansvar</span>
                    <span className="flex-1 text-center">Antall</span>
                    <span className="flex-1 text-center">Order ID</span>
                    <span className="flex-1 text-center">Velg</span>
                  </li>

                  {waitlist.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-slate-700 bg-white p-3 rounded-lg shadow-sm hover:bg-slate-100 transition-colors duration-200">
                      <div className="flex-1">
                        <span
                          className="cursor-pointer text-blue-500"
                          onClick={() => toggleDropdown(item.order_id)}
                        >
                          {item.responsible_person}
                        </span>
                        {openDropdown === item.order_id && (
                          <div className="mt-2 p-4 bg-slate-50 shadow-lg rounded-lg">
                            <p className="font-semibold">Order medlemmer:</p>
                            <ul>
                              {filterRegistrationsByOrderId(item.order_id).map((filteredItem, idx) => (
                                <li key={idx}>
                                  {filteredItem.email}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <span className="flex-1 text-center">{item.number_of_people}</span>
                      <span className="flex-1 text-center">{item.order_id}</span>
                      <div className="flex-1 text-center">
                        <input
                        placeholder="e"
                          type="checkbox"
                          className="mr-3"
                          checked={selected.includes(item)}
                          onChange={() => handleSelectRegistration(item)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600 text-center py-4">No registrations found</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              onClick={() => handleClickAccept(selected)}
            >
              Accept {waitlist.length > 1 ? "registrations" : "registration"}
            </button>

            <button
              type="button"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              onClick={() => handleClickDecline(selected)}
            >
              Decline {waitlist.length > 1 ? "registrations" : "registration"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
