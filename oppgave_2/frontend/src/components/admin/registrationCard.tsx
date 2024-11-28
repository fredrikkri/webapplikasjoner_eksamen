import { useState } from "react";
import { Event } from "@/types/Event";
import { Registration } from "@/types/Registration";
import { deleteWaitlistRegistration } from "@/lib/services/waitlistRegistrations";

interface RegCardProps {
  event: Event | null;
  waitlist: Registration[] | null;
}

const handleClickAccept = async (selected: string[]) => {
  console.log("Selected registrations:", selected);
};

const handleClickDecline = async (selected: string[]) => {
  console.log("Declined registrations:", selected);
  for (let i = 0; i < selected.length; i++) {
    const registrationId = selected[i];

    try {
      const success = await deleteWaitlistRegistration(registrationId);

      if (success) {
        console.log(`Registration ${registrationId} deleted successfully.`);
      } else {
        console.log(`Failed to delete registration ${registrationId}.`);
      }
    } catch (error) {
      console.error(`Error deleting registration ${registrationId}:`, error);
    }
  }

  console.log("Accepted registrations:", selected);
};

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectRegistration = (orderId: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId) 
        : [...prevSelected, orderId] 
    );
  };

  const handleSelectAll = () => {
    if (waitlist) {
      if (selected.length === waitlist.length) {
        setSelected([]); // Deselect all
      } else {
        setSelected(waitlist.map(item => item.order_id)); // Select all
      }
    }
  };

  if (!event) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50/80 p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-800">Fant ikke arrangementet</p>
      </div>
    );
  }

  if (!waitlist || waitlist.length === 0) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50/80 p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
        <div className="w-16 h-16 mx-auto mb-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-800">Fant ingen påmeldinger</p>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-xl overflow-hidden border-l-4 border-blue-500 max-w-5xl mx-auto">
      <div className="p-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                Påmeldinger for {event.title}
              </h2>
              <p className="text-sm text-slate-500">
                Administrer ventelistepåmeldinger
              </p>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {waitlist.length} {waitlist.length === 1 ? 'påmelding' : 'påmeldinger'}
            </span>
          </div>
        </div>

        {/* Event Stats */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">Ledige plasser: </span>
              <span className="ml-1 text-slate-900">{event.available_slots}/{event.total_slots}</span>
            </div>
          </div>
        </div>

        {/* Registration List */}
        <div className="bg-slate-50 rounded-xl overflow-hidden">
          {Array.isArray(waitlist) && waitlist.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Email ansvar</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Antall påmeldte</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">Order ID</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-slate-700">
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={waitlist.length > 0 && selected.length === waitlist.length}
                          onChange={handleSelectAll}
                        />
                        <span>Velg alle</span>
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150 ${
                        selected.includes(item.order_id) ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <td className="py-4 px-6 text-slate-700">{item.responsible_person}</td>
                      <td className="py-4 px-6 text-center text-slate-700">{item.number_of_people}</td>
                      <td className="py-4 px-6 text-center font-mono text-sm text-slate-600">{item.order_id}</td>
                      <td className="py-4 px-6 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={selected.includes(item.order_id)}
                          onChange={() => handleSelectRegistration(item.order_id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">Ingen påmeldte</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 pt-8 mt-6 border-t border-slate-200">
          <button
            type="button"
            disabled={selected.length === 0}
            className={`flex-1 inline-flex justify-center items-center px-6 py-3 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm ${
              selected.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
            onClick={() => handleClickAccept(selected)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {selected.length > 1 ? `Aksepter ${selected.length} påmeldinger` : 'Aksepter påmelding'}
          </button>

          <button
            type="button"
            disabled={selected.length === 0}
            className={`flex-1 inline-flex justify-center items-center px-6 py-3 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm ${
              selected.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            }`}
            onClick={() => handleClickDecline(selected)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {selected.length > 1 ? `Avslå ${selected.length} påmeldinger` : 'Avslå påmelding'}
          </button>
        </div>
      </div>
    </article>
  );
}
