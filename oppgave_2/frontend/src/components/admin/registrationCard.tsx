import { Event } from "@/types/Event";

interface WaitlistItem {
  id: string;
  event_id: string;
  email: string;
  has_paid: string;
  registration_date: string;
  order_id: string;
}

interface RegCardProps {
  event: Event | null;
  waitlist: WaitlistItem[];
}

const handleClick = () => {
  
};

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;
  if (!event) return (
    <div className="rounded-lg border-2 border-slate-100 bg-slate-50 p-6 text-center">
      <p className="text-lg font-medium text-slate-800">
        Fant ikke arrangementet
      </p>
    </div>
  );
  const firstWaitlistItem = waitlist[0];
  return (
    <article className="inline-block border-2 border-gray-500 p-5">
      <h2 className="text-2xl font-semibold">
        Påmeldinger for {event.title}</h2>
      <ul className="p-2">
        <li><p>Order id: {firstWaitlistItem.order_id}</p></li>
        <li><p>Antall: {waitlist.length}</p></li>
      </ul>
      <ul className="p-2">
        {waitlist.map((item, index) => (
          <li key={index}>
            [ {item.email} ] 
          </li>
        ))}
      </ul>
      <div className="flex space-x-4 p-1">
        <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleClick}>
          {waitlist.length > 1 ? 'Aksepter påmeldinger' : 'Aksepter påmelding'}
        </button>

        <button type="button" className="bg-red-500 text-white py-2 px-4 pl-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={handleClick}>
          {waitlist.length > 1 ? 'Avslå påmeldinger' : 'Avslå påmelding'}
        </button>
      </div>


    </article>
  );
}
