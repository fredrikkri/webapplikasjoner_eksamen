import { Event } from "@/types/Event";
import { Registration } from "@/types/Registration";

interface RegCardProps {
  event: Event | null;
  waitlist: Registration[] | null;
}

const handleClickAccept = () => {
  // Handle accepting registrations
};

const handleClickDecline = () => {
  // Handle declining registrations
};

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;
  console.log("event!!!!", event)
  console.log("waitlist!!!", waitlist)

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

  if (waitlist?.length === undefined) {
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

  if(event && waitlist?.length !== undefined) return (
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <span>Order ID: {waitlist.length}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Antall påmeldte: {waitlist.length}</span>
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Påmeldte e-postadresser</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              {Array.isArray(waitlist) && waitlist.length > 0 ? (
                <ul className="space-y-2">
                  {waitlist.map((item, index) => (
                    <li key={index} className="flex items-center text-slate-700 bg-white p-3 rounded-lg shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {item.email}
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
              onClick={handleClickAccept}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {waitlist.length > 1 ? 'Aksepter påmeldinger' : 'Aksepter påmelding'}
            </button>

            <button
              type="button"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              onClick={handleClickDecline}
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
