
interface WaitlistItem {
  name: string;
  email: string;
}

interface RegCardProps {
  event: string;
  waitlist: WaitlistItem[];
}

export default function RegCard(props: RegCardProps) {
  const { event, waitlist } = props;

  return (
    <article className="border-2 border-gray-500 p-5">
      <h2 className="text-2xl font-semibold">
        Påmeldinger for {event}</h2>
      <p>{waitlist.length} people on the waitlist.</p>
      <ul>
        {waitlist.map((item, index) => (
          <li key={index}>
            {item.name} [ {item.email} ]
          </li>
        ))}
      </ul>
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {waitlist.length > 1 ? 'Aksepter påmeldinger' : 'Aksepter påmelding'}
        </button>

        <button className="bg-red-500 text-white py-2 px-4 pl-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
          {waitlist.length > 1 ? 'Avslå påmeldinger' : 'Avslå påmelding'}
        </button>
      </div>


    </article>
  );
}
