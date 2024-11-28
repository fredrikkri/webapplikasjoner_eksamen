import { useState } from "react";
import { Event } from "@/types/Event";
import { Registration } from "@/types/Registration";

interface RegCardProps {
  event: Event | null;
  waitlist: Registration[] | null;
}

const handleClickAccept = (selected: string[]) => {
  console.log("Accepted registrations:", selected);
  
};

const handleClickDecline = (selected: string[]) => {
  console.log("Declined registrations:", selected);
};

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;

  const [selected, setSelected] = useState<string[]>([]);

  // SRC: kilde: chatgpt.com /
  const handleSelectRegistration = (orderId: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId) 
        : [...prevSelected, orderId] 
    );
  };

  // SRC: kilde: chatgpt.com  /
  if (!event) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-800">Fant ikke arrangementet</p>
      </div>
    );
  }
// SRC: kilde: chatgpt.com  /
  if (!waitlist || waitlist.length === 0) {
    return (
      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-800">Fant ingen påmeldinger</p>
      </div>
    );
  }

  // SRC: kilde: chatgpt.com  || med endringer /
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-blue-500">
      <div className="p-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Påmeldinger for {event.title}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {waitlist.length} {waitlist.length === 1 ? 'påmelding' : 'påmeldinger'}
            </span>
          </div>
        </div>

        {/* Registration Details */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Antall plasser: {event.available_slots}/{event.total_slots}</span>
              </div>
            </div>
          </div>


          <div className="space-y-2">
            <div className="bg-slate-50 rounded-lg p-4">
            {Array.isArray(waitlist) && waitlist.length > 0 ? (
              <ul className="space-y-2">
              {/* Header Row */}
                <li className="flex items-center font-semibold text-slate-700 bg-slate-100 p-3 rounded-lg shadow-sm">
                  <span className="flex-1">Email ansvar</span>
                  <span className="flex-1 text-center">Antall påmeldte</span>
                  <span className="flex-1 text-center">Order ID</span>
                  <span className="flex-1 text-center">Velg</span>
                </li>

        {/* Waitlist Items */}
        {waitlist.map((item, index) => (
          <li key={index} className="flex items-center justify-between text-slate-700 bg-white p-3 rounded-lg shadow-sm hover:bg-slate-100 transition-colors duration-200">
            {/* Email and Responsible Person */}
            <div className="flex-1">{item.responsible_person}</div>
            {/* Number of People */}
            <span className="flex-1 text-center">{item.number_of_people}</span>
            {/* Order ID */}
            <span className="flex-1 text-center">{item.order_id}</span>
            {/* Checkbox to select */}
            <div className="flex-1 text-center">
              <input
                placeholder="switchboxting"
                type="checkbox"
                className="mr-3"
                checked={selected.includes(item.order_id)}
                onChange={() => handleSelectRegistration(item.order_id)}
              />
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-slate-600 text-center py-4">Ingen påmeldte</p>
    )}
  </div>
</div>






          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              onClick={() => handleClickAccept(selected)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {waitlist.length > 1 ? 'Aksepter påmeldinger' : 'Aksepter påmelding'}
            </button>

            <button
              type="button"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              onClick={() => handleClickDecline(selected)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {waitlist.length > 1 ? 'Avslå påmeldinger' : 'Avslå påmelding'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
