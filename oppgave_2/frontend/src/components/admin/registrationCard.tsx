import { useState } from "react";
import { Event } from "@/types/Event";
import { Registration } from "@/types/Registration";
import { useCreateRegistrationById } from "@/hooks/useRegistration";
import { deleteWaitlistRegistration } from "@/lib/services/waitlistRegistrations";
import { getWaitListByEventId } from "@/hooks/useWaitlistRegistration";

interface RegCardProps {
  event: Event | null;
  waitlist: Registration[] | null;
}

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;
  const { addRegistration, loading, error } = useCreateRegistrationById();
  const { waitlist: fetchedWaitlist } = getWaitListByEventId(event?.id || "");
  const [selected, setSelected] = useState<Registration[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (waitlist) {
      if (selected.length === waitlist.length) {
        setSelected([]); // Deselect all
      } else {
        setSelected(waitlist.map(item => item)); // Select all
      }
    }
  };

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
    const uniqueSelected = Array.from(
      new Map(selected.map((item) => [item.order_id, item])).values()
    );
    const orderIds: string[] = uniqueSelected.map((registration) => registration.order_id);

      try {
        await addRegistration(orderIds);
      } catch (error) {
        console.error(`Error accepting registration:`, error);
      }
    

    for (let i = 0; i < uniqueSelected.length; i++) {
      const registration = uniqueSelected[i];
      try {
      
        await deleteWaitlistRegistration(registration.order_id);
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

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500">
      <div className="p-6">


        <div className="border-b border-slate-200 pb-6 mb-8">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-slate-900">
      Registrations for {event.title}
    </h2>
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {waitlist.length} {waitlist.length === 1 ? "registration" : "registrations"}
    </span>
  </div>


</div>


        <div className="space-y-6">
        <div className="space-y-6">
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="flex items-center justify-between sm:justify-start space-x-4">
        <div className="flex items-center text-slate-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-lg font-semibold">Available Slots</span>
        </div>
        <div className="text-xl font-bold text-blue-700">
          {event.available_slots}/{event.total_slots}
        </div>
      </div>
    </div>

    {/* Additional Information */}
    <div className="mt-4 text-sm text-slate-500">
      <p>Plassene oppdateres i sanntid, og nye påmeldinger blir tilgjengelige etter hvert som de blir bekreftet.</p>
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
                    <span className="flex-1 text-center">                    
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={waitlist.length > 0 && selected.length === waitlist.length}
                          onChange={handleSelectAll}
                        />
                        <span>Velg alle</span>
                      </label>
                    </span>
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
                            <p className="font-semibold">Ordre medlemmer:</p>
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
